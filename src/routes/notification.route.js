import express from "express";
import * as notificationController from "../controllers/notification.controller.js";

const notificationRouter = express.Router();

// isRead가 false인 목록 조회 (userId별)
notificationRouter.get(
  "/users/:userId/notifications",
  notificationController.getUnreadNotifications
);

// isRead를 true로 변경
notificationRouter.patch(
  "/:notificationId",
  notificationController.updateIsRead
);

export default notificationRouter;
