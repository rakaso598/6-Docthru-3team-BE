import express from "express";
import { getMyInfo, getMyChallenges } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyAccessToken, getMyInfo);

router.get("/me/challenges", verifyAccessToken, getMyChallenges);

export default router;
