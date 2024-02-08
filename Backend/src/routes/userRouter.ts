import { Router } from "express";
import {
  logoutUser,
  registerUser,
  loginUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCover,
  getUserChannelProfile,
  getUserHistory,
} from "../controllers/userController";
import { upload } from "../middleware/multerMiddleware";
import { verifyJWT } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changePassword);
router.get("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-details", verifyJWT, updateAccountDetails);
router.patch("/avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.patch("/cover", verifyJWT, upload.single("coverImage"), updateUserCover);
router.get("/c//:username", verifyJWT, getUserChannelProfile);
router.get("/history", verifyJWT, getUserHistory);

export default router;
