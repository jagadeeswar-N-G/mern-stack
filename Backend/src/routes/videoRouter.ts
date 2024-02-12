import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/videoController";
import { upload } from "../middleware/multerMiddleware";
import { verifyJWT } from "../middleware/authMiddleware";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post(
  "/publish",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);
router.route("/").get(getAllVideos);

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router;
