import { Router } from "express";
import { verifyJWT } from "../middleware/authMiddleware";

const router = Router();

router.use(verifyJWT);


