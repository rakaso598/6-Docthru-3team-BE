import feedbackRepository from "../repositories/feedback.repository.js";

async function getFeedbacks(workId) {
  return feedbackRepository.findByWorkId(workId);
}

async function addFeedback(workId, authorId, content) {
  return feedbackRepository.create(workId, authorId, content);
}

async function editFeedback(feedbackId, content) {
  return feedbackRepository.update(feedbackId, content);
}

async function deleteFeedback(feedbackId) {
  return feedbackRepository.remove(feedbackId);
}

export default { getFeedbacks, addFeedback, editFeedback, deleteFeedback };
