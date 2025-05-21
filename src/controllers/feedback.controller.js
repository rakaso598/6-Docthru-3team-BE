import feedbackService from "../services/feedback.service.js";

// 목록 조회
export async function getFeedbacks(req, res, next) {
  try {
    const feedbacks = await feedbackService.getFeedbacks(req.params.workId);
    res.json(feedbacks);
  } catch (err) {
    next(err);
  }
}

// 등록
export async function addFeedback(req, res, next) {
  try {
    const authorId = req.user.userId;
    const { content } = req.body;
    const feedback = await feedbackService.addFeedback(
      req.params.workId,
      authorId,
      content
    );
    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
}

// 수정
export async function editFeedback(req, res, next) {
  try {
    const { content } = req.body;
    const feedbackId = req.params.feedbackId;
    const userId = req.user.userId;
    const feedback = await feedbackService.editFeedback(
      feedbackId,
      content,
      userId
    );
    res.json(feedback);
  } catch (err) {
    next(err);
  }
}

// 삭제
export async function deleteFeedback(req, res, next) {
  try {
    const feedbackId = req.params.feedbackId;
    const userId = req.user.userId;
    await feedbackService.deleteFeedback(feedbackId, userId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
