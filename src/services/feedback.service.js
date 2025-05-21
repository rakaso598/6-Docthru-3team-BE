import feedbackRepository from "../repositories/feedback.repository.js";
import workRepository from "../repositories/work.repository.js";

// 피드백 알림 생성
async function addFeedback(workId, authorId, content) {
  // 1. 피드백 생성
  const feedback = await feedbackRepository.create(workId, authorId, content);

  // 2. work의 작성자 조회
  const work = await workRepository.findById(workId);
  if (!work) {
    throw new Error("해당 work를 찾을 수 없습니다.");
  }

  // 3. 알림 메시지 생성
  const message = "새 피드백이 등록되었습니다.";

  // 4. work 작성자에게 알림 생성 (본인이 자기 work에 피드백을 다는 경우 제외 가능)
  if (work.authorId !== authorId) {
    await notificationRepository.createNotification(work.authorId, message);
  }

  return feedback;
}

// 목록 조회
async function getFeedbacks(workId) {
  return feedbackRepository.findByWorkId(workId);
}

// 등록
async function addFeedback(workId, authorId, content) {
  return feedbackRepository.create(workId, authorId, content);
}

// 수정
async function editFeedback(feedbackId, content, userId) {
  // 피드백 조회해서 작성자 확인
  const feedback = await feedbackRepository.findById(feedbackId);
  if (!feedback) {
    const err = new Error("피드백을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  if (feedback.authorId !== userId) {
    const err = new Error("본인이 작성한 피드백만 수정할 수 있습니다.");
    err.status = 403;
    throw err;
  }
  // 작성자가 맞으면 수정 진행
  return feedbackRepository.update(feedbackId, content);
}

// 삭제
async function deleteFeedback(feedbackId, userId) {
  const feedback = await feedbackRepository.findById(feedbackId);
  if (!feedback) {
    const err = new Error("피드백을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }
  if (feedback.authorId !== userId) {
    const err = new Error("본인이 작성한 피드백만 삭제할 수 있습니다.");
    err.status = 403;
    throw err;
  }
  return feedbackRepository.remove(feedbackId);
}

export default { getFeedbacks, addFeedback, editFeedback, deleteFeedback };
