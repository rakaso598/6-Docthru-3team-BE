import express from "express";
import * as notificationController from "../controllers/notification.controller.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const notificationRouter = express.Router();

// isRead가 false인 목록 조회
notificationRouter.get(
  "/unread",
  verifyAccessToken,
  notificationController.getUnreadNotifications
);

// 알림 목록 조회
notificationRouter.get(
  "/",
  verifyAccessToken,
  notificationController.getNotifications
);

// isRead를 true로 변경
notificationRouter.patch(
  "/:notificationId",
  verifyAccessToken,
  notificationController.updateIsRead
);

export default notificationRouter;
