import express from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { softDeleteWork } from "../controllers/admin.controller.js";
import { adminValidator } from "../middlewares/validator.js";
import {
  getApplications,
  updateApplicationStatus,
} from "../controllers/challenge.controller.js";

const adminRouter = express.Router({ mergeParams: true });

adminRouter.get(
  "/applications",
  verifyAccessToken,
  adminValidator,
  getApplications
);
adminRouter.patch(
  "/challenges/:challengeId",
  verifyAccessToken,
  adminValidator,
  updateApplicationStatus
);
adminRouter.patch("/works/:workId", verifyAccessToken, softDeleteWork);

export default adminRouter;
