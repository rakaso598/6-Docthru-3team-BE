import notificationService from "../services/notification.service.js";

// isRead가 false인 목록 조회
export const getUnreadNotifications = async (req, res, next) => {
  const { userId } = req.params;
  try {
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
  const { notificationId } = req.params;
  const { isRead } = req.body;
  try {
    const updated = await notificationService.updateIsRead(
      notificationId,
      isRead
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
};
