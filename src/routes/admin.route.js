import express from "express";
import { verifyAccessToken } from "../middlewares/verifyToken.js";
import { deleteWork } from "../controllers/admin.controller.js";

const adminRouter = express.Router({ mergeParams: true });

adminRouter.patch("/works/:workId", verifyAccessToken, deleteWork);

export default adminRouter;
