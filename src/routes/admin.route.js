import express from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { softDeleteWork } from "../controllers/admin.controller.js";
import {
  getApplications,
  updateApplicationStatus,
} from "../controllers/challenge.controller.js";

const adminRouter = express.Router({ mergeParams: true });

adminRouter.get("/applications", getApplications);
adminRouter.patch("/challenges/:challengeId", updateApplicationStatus);
adminRouter.patch("/works/:workId", softDeleteWork);

export default adminRouter;
