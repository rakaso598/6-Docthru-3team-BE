import express from "express";
import { getMyInfo, getMyChallenges } from "../controllers/user.controller.js";
import {
  getApplication,
  getApplications,
} from "../controllers/challenge.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/me", verifyAccessToken, getMyInfo);
userRouter.get("/me/challenges", verifyAccessToken, getMyChallenges);
userRouter.get("/me/applications", verifyAccessToken, getApplications);
userRouter.get(
  "/me/applications/:applicationId",
  verifyAccessToken,
  getApplication
);

export default userRouter;
