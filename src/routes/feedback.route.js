import express from "express";
import * as feedbackController from "../controllers/feedback.controller.js";

const feedbackRouter = express.Router();

feedbackRouter.get("/works/:workId/feedbacks", feedbackController.getFeedbacks);
feedbackRouter.post("/works/:workId/feedbacks", feedbackController.addFeedback);
feedbackRouter.patch("/feedbacks/:feedbackId", feedbackController.editFeedback);
feedbackRouter.delete(
  "/feedbacks/:feedbackId",
  feedbackController.deleteFeedback
);

export default feedbackRouter;
