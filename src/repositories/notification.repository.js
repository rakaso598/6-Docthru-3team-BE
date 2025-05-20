import prisma from "../prisma/client.prisma.js";

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

async function updateIsRead(notificationId, isRead) {
  return prisma.notification.update({
    where: { id: Number(notificationId) },
    data: { isRead },
  });
}

export default { findUnreadByUserId, updateIsRead };
