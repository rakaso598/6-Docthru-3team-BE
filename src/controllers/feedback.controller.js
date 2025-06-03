import feedbackService from "../services/feedback.service.js";

// 목록 조회
export const getFeedbacks = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

    const feedbacks = await feedbackService.getFeedbacks(
      Number(workId),
      userId
    );

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "피드백 목록 조회 실패" });
  }
};

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
    const { feedbackId, workId } = req.params;
    const { userId, role } = req.user;
    const feedback = await feedbackService.editFeedback(
      feedbackId,
      workId,
      content,
      userId,
      role
    );
    res.json(feedback);
  } catch (err) {
    next(err);
  }
}

// 삭제
export async function deleteFeedback(req, res, next) {
  const { feedbackId, workId } = req.params;
  const userId = req.user.userId;
  try {
    await feedbackService.deleteFeedback(feedbackId, workId, userId);
    res.status(200).json({ message: "피드백이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
}
