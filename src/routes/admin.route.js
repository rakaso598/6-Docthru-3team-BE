import express from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { softDeleteWork } from "../controllers/admin.controller.js";

const adminRouter = express.Router({ mergeParams: true });

adminRouter.patch("/works/:workId", verifyAccessToken, softDeleteWork);

export default adminRouter;
