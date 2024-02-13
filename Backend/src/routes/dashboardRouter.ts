import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware.ts";
import { getChannelStats, getChannelVideos } from "../controllers/dashboardController.ts";


const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/stats").get(getChannelStats);
router.route("/videos").get(getChannelVideos);

export default router;
