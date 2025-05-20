import express from "express";
import { getMyInfo } from "../controllers/user.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.get("/me", verifyAccessToken, getMyInfo);

export default router;
