import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware";
import { getLikedComments, getLikedTweets, getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/likeController";


const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);
router.route("/comments").get(getLikedComments);
router.route("/tweets").get(getLikedTweets);

export default router;
