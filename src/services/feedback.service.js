import feedbackRepository from "../repositories/feedback.repository.js";
import workRepository from "../repositories/work.repository.js";
import notificationService from "./notification.service.js";
import { findUserById } from "../repositories/user.repository.js";

// 피드백 알림 생성
async function addFeedback(workId, authorId, content) {
  // 피드백 생성
  const feedback = await feedbackRepository.create(workId, authorId, content);

  // work 작성자에게 알림 전송 (본인이 아니면)
  const work = await workRepository.findIdAndTitle(workId);
  if (work.authorId !== authorId) {
    const message = notificationService.notificationMessages.newFeedback(
      work.challenge.title
    );
    await notificationService.createNotification(work.authorId, message);
  }

  return feedback;
}

// 목록 조회
async function getFeedbacks(workId, userId) {
  const feedbacks = await feedbackRepository.findByWorkId(workId);
  return feedbacks.map((feedback) => ({
    ...feedback,
    isAuthor: feedback.authorId === userId, // 본인 글 여부
  }));
}

// 수정
async function editFeedback(feedbackId, workId, content, userId, role) {
  // 피드백 조회해서 작성자 확인
  const feedback = await feedbackRepository.findById(feedbackId);
  if (!feedback) {
    const err = new Error("피드백을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  if (feedback.authorId !== userId && role !== "ADMIN") {
    const err = new Error("본인이 작성한 피드백만 수정할 수 있습니다.");
    err.status = 403;
    throw err;
  }
  if (feedback.work.challenge.isClosed) {
    const err = new Error("완료된 첼린지에 대한 피드백은 수정이 불가능합니다.");
    err.status = 403;
    throw err;
  }
  // work 작성자에게 알림 전송 (본인이 아니면)
  const work = await workRepository.findIdAndTitle(workId);
  if (work.authorId !== userId) {
    const message = notificationService.notificationMessages.updateFeedback(
      work.challenge.title
    );
    await notificationService.createNotification(work.authorId, message);
  }
  // 작성자가 맞으면 수정 진행
  return feedbackRepository.update(feedbackId, content);
}

// 삭제
async function deleteFeedback(feedbackId, workId, userId) {
  const feedback = await feedbackRepository.findById(feedbackId);
  if (!feedback) {
    const err = new Error("피드백을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  if (feedback.work.challenge.isClosed) {
    const err = new Error("완료된 첼린지에 대한 피드백은 삭제가 불가능합니다.");
    err.status = 403;
    throw err;
  }
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error("사용자 정보를 찾을 수 없습니다.");
    err.status = 401;
    throw err;
  }
  if (user.role === "ADMIN") {
    return feedbackRepository.remove(feedbackId);
  }
  if (feedback.authorId !== userId) {
    const err = new Error("본인이 작성한 피드백만 삭제할 수 있습니다.");
    err.status = 403;
    throw err;
  }
  // work 작성자에게 알림 전송 (본인이 아니면)
  const work = await workRepository.findIdAndTitle(workId);
  if (work.authorId !== userId) {
    const message = notificationService.notificationMessages.deleteFeedback(
      work.challenge.title
    );
    await notificationService.createNotification(work.authorId, message);
  }
  return feedbackRepository.remove(feedbackId);
}

export default { getFeedbacks, addFeedback, editFeedback, deleteFeedback };
