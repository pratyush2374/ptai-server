import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Some error occured while generating Access/Refresh token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password, height, weight, goal, preferences, logs, age } = req.body;

    if ([fullName, username, email, password, height, weight, goal, preferences?.diet, preferences?.exercises, age].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Incorrect Email Format");
    }

    const doesExist = await User.findOne({ $or: [{ username }, { email }] });
    if (doesExist) {
        throw new ApiError(409, "User already exists");
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatarRes = await uploadOnCloudinary(avatarLocalPath);
    if (!avatarRes) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        name: fullName,
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatarRes.url,
        height,
        weight,
        goal,
        preferences,
        age,
        logs,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -createdAt -updatedAt -__v"
    );

    if (!createdUser) {
        throw new ApiError(500, "User not created, something went wrong!");
    }

    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully! :)"));
});


//Logging in a user
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email || username)) {
        throw new ApiError(400, "Enter at least one field - email/username");
    }

    const userData = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!userData) {
        throw new ApiError(404, "User doesn't exist, Sign up");
    }

    const isCorrect = await userData.isPasswordCorrect(password);

    if (!isCorrect) {
        throw new ApiError(401, "Invalid Credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userData._id);

    const updatedUserData = await User.findById(userData._id).select(
        "-password -refreshToken -createdAt -updatedAt -__v"
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: updatedUserData,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully! :)"
            )
        );
});

//Logging out a user
const logOutUser = asyncHandler(async (req, res) => {
    const userToLogout = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: { refreshToken: 1 },
        },
        {
            new: true,
        }
    ).select(
        "-password -refreshToken -createdAt -updatedAt -__v"
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, userToLogout, "Logged Out Successfully"));
});

const refreshBothTokens = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token must be provided");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const userToGiveNewTokens = await User.findById(
            decodedToken?._id
        ).select("-password -createdAt -updatedAt -__v");

        if (!userToGiveNewTokens) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (incomingRefreshToken !== userToGiveNewTokens?.refreshToken) {
            throw new ApiError(401, "Refresh Token is Expired or Used");
        }

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(userToGiveNewTokens._id);

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        res.status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", newRefreshToken, cookieOptions)
            .json(
                new ApiResponse(200, userToGiveNewTokens, "New Tokens created")
            );
    } catch (error) {
        throw new ApiError(
            400,
            error?.message || "Some error occurred while generating tokens"
        );
    }
});

//Changing password
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isCorrect) {
        throw new ApiError(400, "Incorrect password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully !"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user, "User details"));
});

export {
    registerUser,
    loginUser,
    logOutUser,
    refreshBothTokens,
    changeCurrentPassword,
    getCurrentUser,
};
