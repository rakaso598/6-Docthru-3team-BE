import express from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { softDeleteWork } from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/verify.js";
import { updateApplicationStatus } from "../controllers/challenge.controller.js";

const adminRouter = express.Router({ mergeParams: true });

adminRouter.patch(
  "/challenges/:challengeId",
  verifyAccessToken,
  verifyAdmin,
  updateApplicationStatus
);
adminRouter.patch("/works/:workId", verifyAccessToken, softDeleteWork);

export default adminRouter;
