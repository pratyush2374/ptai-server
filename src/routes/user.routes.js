import { Router } from "express";
import {
    loginUser,
    logOutUser,
    registerUser,
    refreshBothTokens,
    changeCurrentPassword,
    getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    updateFullName,
    updateUserAvatar,
    updateUserName,
} from "../controllers/updateUser.controller.js";

const userRouter = Router();

userRouter.route("/register").post(
    upload.single("avatar"), // Handling a single 'avatar' file upload
    registerUser
);

userRouter.route("/login").post(loginUser);

//Secured routes
userRouter.route("/logout").post(verifyJWT, logOutUser);

userRouter.route("/refresh-token").post(refreshBothTokens);

userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword);

userRouter.route("/get-user").get(verifyJWT, getCurrentUser);

//Updating user details
//Fullname
userRouter.route("/update-fullname").patch(verifyJWT, updateFullName);

//Username
userRouter.route("/update-username").patch(verifyJWT, updateUserName);

//Updating Avatar
userRouter
    .route("/update-avatar")
    .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);


export default userRouter;
