import { Router } from "express";
import { registerUser } from "../controllers/userController";
import { upload } from "../middleware/multerMiddleware";

const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

export default router;
