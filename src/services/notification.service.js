import prisma from "../prisma/client.prisma.js";
import notificationRepository from "../repositories/notification.repository.js";

// 알림 메시지 템플릿
const notificationMessages = {
  challengeUpdate: (challengeTitle) =>
    `'${challengeTitle}' 챌린지가 수정되었어요`,
  challengeDelete: (challengeTitle) =>
    `'${challengeTitle}' 챌린지가 삭제되었어요`,
  challengeStatusChange: (challengeTitle, status) =>
    `관리자에 의해 '${challengeTitle}'(이)가 ${status} 처리되었어요`,
  newWork: (challengeTitle) =>
    `'${challengeTitle}' 챌린지에 작업물이 추가되었어요`,
  newFeedback: (challengeTitle) =>
    `'${challengeTitle}'에 도전한 작업물에 피드백이 추가되었어요`,
  challengeEnd: (challengeTitle) => `'${challengeTitle}'(이)가 마감되었어요`,
  adminAction: (challengeTitle, status, reason) =>
    `관리자에 의해 '${challengeTitle}'(이)가 ${status} 처리되었어요. 사유: ${
      reason || "없음"
    }`,
};

// 알림 생성
async function createNotification(userId, message) {
  return notificationRepository.createNotification(userId, message);
}

// 읽지 않은 목록 조회
async function getUnreadNotifications(userId) {
  return notificationRepository.findUnreadByUserId(userId);
}

// 목록 조회
async function getNotifications(userId) {
  return notificationRepository.findByUserId(userId);
}

// 읽음 처리
async function updateIsRead(notificationId, userId) {
  // 알림 소유자 확인
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });
  if (!notification) throw new Error("알림을 찾을 수 없습니다");
  if (notification.userId !== userId) throw new Error("권한이 없습니다");

  return notificationRepository.updateIsRead(notificationId, true);
}

export default {
  notificationMessages,
  createNotification,
  getUnreadNotifications,
  getNotifications,
  updateIsRead,
};
