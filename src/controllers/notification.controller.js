import notificationService from "../services/notification.service.js";

// isRead가 false인 목록 조회
export const getUnreadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getUnreadNotifications(
      userId
    );
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// 모든 알림 목록 조회
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notifications = await notificationService.getUnreadNotifications(
      userId
    );
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

// isRead를 true로 변경
export const updateIsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;
    const { isRead } = req.body;
    const updated = await notificationService.updateIsRead(
      notificationId,
      isRead
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
