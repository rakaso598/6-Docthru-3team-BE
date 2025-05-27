import challengeRepository from "../repositories/challenge.repository.js";
import { BadRequestError, NotFoundError } from "../exceptions/exceptions.js";
import { ExceptionMessage } from "../exceptions/ExceptionMessage.js";
import notificationService from "./notification.service.js";

//챌린지 생성
async function create(challenge, userId) {
  if (
    !userId ||
    !challenge.title ||
    !challenge.description ||
    !challenge.category ||
    !challenge.docType ||
    !challenge.originalUrl ||
    !challenge.deadline ||
    !challenge.maxParticipant
  ) {
    throw new BadRequestError(ExceptionMessage.INVALID_INPUT);
  }

  const newChallenge = await challengeRepository.save(challenge, userId);

  if (!newChallenge) throw new Error("Failed create newChallenge");

  return newChallenge;
}

//추후 사용 예정
// const findAllChallenges = async () => {
//   return await challengeRepository.findAllChallenges();
// };

// 챌린지 상세 조회
const getChallengeDetailById = async (challengeId) => {
  return await challengeRepository.findChallengeDetailById(challengeId);
};

// 챌린지 수정
const findChallengeById = async (challengeId) => {
  return await challengeRepository.findChallengeById(challengeId);
};
const updateChallenge = async (challengeId, userId, data) => {
  const challenge = await challengeRepository.findChallengeById(challengeId);
  if (!challenge) throw new Error("챌린지가 존재하지 않습니다.");

  if (challenge.authorId !== userId) {
    const err = new Error("작성자만 수정할 수 있습니다.");
    err.statusCode = 403;
    throw err;
  }

  // 어드민이 수정했을 경우 작성자에게 알림
  if (challenge.authorId !== userId) {
    const message = notificationService.notificationMessages.challengeUpdate(
      challenge.title
    );
    await notificationService.createNotification(challenge.authorId, message);
  }

  return await challengeRepository.updateChallenge(challengeId, data);
};

// 챌린지 삭제
const deleteChallenge = async (challengeId, userId) => {
  const challenge = await challengeRepository.findChallengeById(challengeId);
  if (!challenge) {
    throw new Error("챌린지가 존재하지 않습니다.");
  }

  if (challenge.authorId !== userId) {
    const err = new Error("작성자만 삭제할 수 있습니다.");
    err.statusCode = 403;
    throw err;
  }
  await challengeRepository.deleteChallengeById(challengeId);

  if (challenge.authorId !== userId) {
    const message = notificationService.notificationMessages.challengeDelete(
      challenge.title
    );

    await notificationService.createNotification(challenge.authorId, message);
  }
};

//챌린지 목록 조회(쿼리)
async function getChallenges(options) {
  return challengeRepository.getChallenges(options);
}

/**
 * 챌린지 신청 관리
 */
async function updateApplicationById(challengeId, data) {
  try {
    const updatedApplication = await challengeRepository.updateApplication(
      challengeId,
      data
    );
    // 챌린지 정보 조회
    const challenge = await challengeRepository.findChallengeById(challengeId);
    // 챌린지가 존재하고, 작성자와 현재 사용자가 다를 경우 알림 전송
    if (challenge && challenge.authorId !== userId) {
      if (["REJECTED", "DELETED"].includes(updatedApplication.adminStatus)) {
        const message = notificationService.notificationMessages.adminAction(
          challenge.title,
          updatedApplication.adminStatus,
          updatedApplication.adminMessage
        );
        await notificationService.createNotification(
          challenge.authorId,
          message
        );
      } else {
        const message =
          notificationService.notificationMessages.challengeStatusChange(
            challenge.title,
            updatedApplication.adminStatus
          );
        await notificationService.createNotification(
          challenge.authorId,
          message
        );
      }
    }

    return updatedApplication;
  } catch (e) {
    if (e.code === "P2025") {
      throw new NotFoundError(ExceptionMessage.CHALLENGE_NOT_FOUND);
    }
  }
}

export default {
  create,
  getChallenges,
  findChallengeById,
  // findAllChallenges, 추후 사용 예정
  updateChallenge,
  deleteChallenge,
  getChallengeDetailById,
  updateApplicationById,
};
