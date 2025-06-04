import challengeRepository from "../repositories/challenge.repository.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../exceptions/exceptions.js";
import { ExceptionMessage } from "../exceptions/ExceptionMessage.js";
import notificationService from "./notification.service.js";
import { tryUpgradeUserGrade } from "./user.service.js";

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

// 챌린지 상세 조회
const getChallengeDetailById = async (challengeId) => {
  return await challengeRepository.findChallengeDetailById(challengeId);
};

const findChallengeById = async (challengeId) => {
  return await challengeRepository.findChallengeById(challengeId);
};

// 챌린지 수정
const updateChallenge = async (challengeId, userId, data) => {
  const challenge = await challengeRepository.findChallengeById(challengeId);
  if (!challenge) throw new Error("챌린지가 존재하지 않습니다.");

  if (challenge.isClosed) {
    const error = new Error("완료된 첼린지는 수정이 불가능합니다.");
    error.statusCode = 403;
    throw error;
  }

  const userRoleObj = await challengeRepository.findUserRoleById(userId);
  const userRole = userRoleObj.role;
  if (userRole !== "ADMIN") {
    const err = new Error("관리자만 수정할 수 있습니다.");
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

  if (challenge.isClosed) {
    const error = new Error("완료된 첼린지는 삭제가 불가능합니다.");
    error.statusCode = 403;
    throw error;
  }

  const userRoleObj = await challengeRepository.findUserRoleById(userId);
  const userRole = userRoleObj.role;

  // 관리자가 아니고, 작성자도 아닌 경우 삭제 권한 없음
  if (userRole !== "ADMIN" && challenge.authorId !== userId) {
    const err = new Error("삭제 권한이 없습니다.");
    err.statusCode = 403;
    throw err;
  }

  await challengeRepository.deleteChallengeById(challengeId);

  // 관리자가 삭제했을 경우 작성자에게 알림
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

// 챌린지 신청 관리 - 어드민
async function updateApplicationById(challengeId, data, userId) {
  try {
    // 1. 챌린지 조회
    const challenge = await challengeRepository.findChallengeById(challengeId);

    // 2. 닫힌 챌린지인지 확인
    if (challenge.isClosed) {
      const error = new Error("완료된 첼린지는 수정 및 삭제가 불가능합니다.");
      error.statusCode = 403;
      throw error;
    }

    // 3. 업데이트 실행
    const updatedApplication = await challengeRepository.updateApplication(
      challengeId,
      data
    );

    // 4. 알림 전송
    if (challenge.authorId !== userId) {
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
      throw new NotFoundError(ExceptionMessage.CHALLNEGE_NOT_FOUND);
    } else if (e.statusCode === 403) {
      throw new ForbiddenError(e.message); // 403 에러 처리
    }
  }
}

// 챌린지 신청 목록 조회
async function getApplications({
  page = 1,
  pageSize = 10,
  sort = "appliedAt_desc",
  keyword,
  userId,
}) {
  const offset = (page - 1) * pageSize;

  const options = {
    skip: offset,
    take: pageSize,
    orderBy: {},
    where: {},
  };

  // userId가 있는 경우 authorId 조건 추가
  if (userId) {
    options.where.authorId = userId;
  }

  // 필터 조건
  if (["pending", "accepted", "rejected"].includes(sort)) {
    options.where.adminStatus = sort.toUpperCase();
  }

  // 정렬 조건
  if (sort === "appliedAt_asc") {
    options.orderBy = { appliedAt: "asc" };
  } else if (sort === "appliedAt_desc") {
    options.orderBy = { appliedAt: "desc" };
  } else if (sort === "deadline_asc") {
    options.orderBy = { challenge: { deadline: "asc" } };
  } else if (sort === "deadline_desc") {
    options.orderBy = { challenge: { deadline: "desc" } };
  }

  // 검색 조건
  if (keyword) {
    const keywordFilter = {
      OR: [
        { challenge: { title: { contains: keyword, mode: "insensitive" } } },
        {
          challenge: {
            description: { contains: keyword, mode: "insensitive" },
          },
        },
      ],
    };
    options.where = { ...options.where, ...keywordFilter };
  }

  return challengeRepository.findAllApplications(options);
}

// 챌린지 신청 상세 조회
export const getApplicationById = async (applicationId) => {
  const data = await challengeRepository.findApplicationById(applicationId);
  if (!data) {
    throw new BadRequestError(ExceptionMessage.APPLICATION_NOT_FOUND);
  }
  return data;
};

async function closeAndSelectTopWork(challengeId) {
  const challenge = await challengeRepository.findChallengeDetailById(
    challengeId
  );
  if (!challenge || challenge.isClosed) return;

  // 마감 처리
  await challengeRepository.closeChallenge(challengeId);

  // 좋아요 수 기준으로 작업물 중 top 1~N 추출 (복수 가능성)
  const works = await prisma.work.findMany({
    where: {
      challengeId: challengeId,
      isDeleted: false,
    },
    include: {
      likes: true,
    },
  });

  if (works.length === 0) return;

  // 좋아요 수 기준 정렬
  const sorted = works
    .map((w) => ({ ...w, likeCount: w.likes.length }))
    .sort((a, b) => b.likeCount - a.likeCount);

  const topLikeCount = sorted[0].likeCount;
  const topWorks = sorted.filter((w) => w.likeCount === topLikeCount);

  for (const topWork of topWorks) {
    // user의 추천 count 증가
    await prisma.user.update({
      where: { id: topWork.authorId },
      data: {
        mostRecommendedCount: { increment: 1 },
      },
    });

    await tryUpgradeUserGrade(topWork.authorId);
  }
}

export default {
  create,
  getChallenges,
  getApplications,
  findChallengeById,
  updateChallenge,
  deleteChallenge,
  getChallengeDetailById,
  updateApplicationById,
  getApplicationById,
  closeAndSelectTopWork,
};
