import notificationRepository from "../repositories/notification.repository.js";

async function getUnreadNotifications(userId) {
  return notificationRepository.findUnreadByUserId(userId);
}

async function updateIsRead(notificationId, isRead) {
  return notificationRepository.updateIsRead(notificationId, isRead);
}

export default { getUnreadNotifications, updateIsRead };
