import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  updateProfile,
  verifyOtp,
  getUsers,
  resetPassword,
} from "@controllers";

import { verifyJWT, upload } from "@middlewares";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update-profile").post(verifyJWT, updateProfile);
router.route("/verify-otp").post(verifyJWT, verifyOtp);
// router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("").get(getUsers);

export default router;
