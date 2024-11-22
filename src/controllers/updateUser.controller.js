import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Updating Fullname
const updateFullName = asyncHandler(async (req, res) => {
    const { fullName } = req.body;
    if (!fullName) {
        throw new ApiError(400, "Enter Fullname");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { fullName },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken -createdAt -updatedAt -logs -__v");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Fullname changed successfully"));
});

// Updating username
const updateUserName = asyncHandler(async (req, res) => {
    const { username } = req.body;
    if (!username) {
        throw new ApiError(400, "Enter username");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { username },
        },
        {
            new: true,
        }
    ).select("-password -refreshToken -createdAt -updatedAt -logs -__v");

    return res
        .status(200)
        .json(new ApiResponse(200, user, "Username changed successfully"));
});

// Updating Avatar
const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar File Missing");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Something went wrong while uploading");
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url },
        },
        { new: true }
    ).select("-password -refreshToken -createdAt -updatedAt -logs -__v");

    return res
        .status(200)
        .json(new ApiResponse(200, user.avatar, "Avatar Updated Successfully"));
});

export { updateFullName, updateUserName, updateUserAvatar };
