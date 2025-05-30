import prisma from "../prisma/client.prisma.js";

// 알림 생성
async function createNotification(userId, message) {
  return prisma.notification.create({
    data: {
      userId,
      message,
    },
  });
}

// isRead가 false인 알림 목록 조회
async function findUnreadByUserId(userId) {
  return prisma.notification.findMany({
    where: {
      userId: userId,
      isRead: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// 모든 알림 목록 조회
async function findByUserId(userId) {
  return prisma.notification.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

// isRead
async function updateIsRead(notificationId, isRead) {
  return prisma.notification.update({
    where: { id: Number(notificationId) },
    data: { isRead: isRead, updatedAt: new Date() },
  });
}

export default {
  createNotification,
  findUnreadByUserId,
  findByUserId,
  updateIsRead,
};
