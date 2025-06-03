import challengeRepository from "../repositories/challenge.repository.js";
import likeRepository from "../repositories/like.repository.js";
import workRepository from "../repositories/work.repository.js";
import prisma from "../prisma/client.prisma.js";
import notificationService from "./notification.service.js";
import { tryUpgradeUserGrade } from "./user.service.js";

// 챌린지에 속한 모든 작업물을 페이지네이션하여 조회하고 각 작업물의 좋아요 상태를 포함하여 반환
const findAllWorks = async (userId, challengeId, page, pageSize) => {
  if (!userId) {
    const error = new Error("사용자 아이디가 필요합니다.");
    error.statusCode = 400;
    throw error;
  }

  if (!challengeId) {
    const error = new Error("챌린지 아이디가 필요합니다.");
    error.statusCode = 400;
    throw error;
  }

  const works = await workRepository.findAllWorks(
    challengeId,
    page,
    pageSize,
    userId
  );

  // 각 work에 대해 좋아요 여부를 확인하고 새로운 배열 생성
  const worksWithLikeStatus = await Promise.all(
    works.map(async (work) => {
      const isLiked = await likeRepository.isWorkLikedByUser(work.id, userId);
      return {
        ...work,
        isLiked,
      };
    })
  );

  return worksWithLikeStatus;
};

// 특정 작업물을 조회하고 해당 사용자의 좋아요 상태를 포함하여 반환
const getWorkById = async (workId, userId) => {
  // 유효성 검증 통과시 조회
  const work = await workRepository.findWorkById(workId);

  if (!work) {
    const error = new Error("해당 작업을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const isLiked = await likeRepository.isWorkLikedByUser(workId, userId);

  return { ...work, isLiked };
};

// 특정 작업물을 조회하고 해당 사용자의 좋아요 상태를 포함하여 반환
// 토큰 포함하여 조회
const getWorkByIdAtForm = async (workId, userId, role) => {
  // 작업물 작성자 확인 및 에러처리
  const isAuthor = await workRepository.isAuthor(workId, userId);

  // 어드민이 아니면 작성자만 조회할 수 있음
  if (role !== "ADMIN" && !isAuthor) {
    const error = new Error("작성자만 작업물을 조회할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  // 유효성 검증 통과시 조회
  const work = await workRepository.findWorkById(workId);

  if (!work) {
    const error = new Error("해당 작업을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const isLiked = await likeRepository.isWorkLikedByUser(workId, userId);

  return { ...work, isLiked };
};

// 사용자가 해당 챌린지에 이미 작업물을 등록했는지 확인
const isWorkDuplicate = async (challengeId, authorId) => {
  const work = await workRepository.findWorkByChallengeIdAndAuthorId(
    challengeId,
    authorId
  );

  if (work) {
    const error = new Error("이미 작업물이 존재합니다.");
    error.statusCode = 400;
    throw error;
  }

  return work;
};

// 새로운 작업물을 생성하고 챌린지 참여자로 등록
const createWork = async (challengeId, authorId) => {
  if (!challengeId || !authorId) {
    const error = new Error("필수 항목이 누락되었습니다.");
    error.statusCode = 400;
    throw error;
  }

  const result = await workRepository.createWork(challengeId, authorId);

  // 등급 자동 체크 (EXPERT 승격 조건 충족 시 바로 반영)
  await tryUpgradeUserGrade(authorId);

  // 알림 생성
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });
  if (challenge && challenge.authorId !== authorId) {
    const message = notificationService.notificationMessages.newWork(
      challenge.title
    );
    await notificationService.createNotification(challenge.authorId, message);
  }

  return result;
};

// 작업물 내용을 수정하고 수정된 작업물을 반환 (작성자 권한 확인 포함)
const updateWork = async (workId, challengeId, userId, role, content) => {
  const isAuthor = await workRepository.isAuthor(workId, userId);

  // 어드민이 아니면 작성자만 수정할 수 있음
  if (role !== "ADMIN" && !isAuthor) {
    const error = new Error("작성자만 수정할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  const updatedWork = await workRepository.updateWork(workId, content);
  if (updatedWork.challenge.isClosed) {
    const error = new Error(
      "완료된 첼린지에 대한 작업물은 수정이 불가능합니다."
    );
    error.statusCode = 403;
    throw error;
  }

  // 알림 생성
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });
  if (challenge && challenge.authorId !== userId) {
    const message = notificationService.notificationMessages.updateWork(
      challenge.title
    );
    await notificationService.createNotification(challenge.authorId, message);
  }

  return updatedWork;
};

// 작업물을 영구적으로 삭제
const hardDeleteWork = async (workId, challengeId, userId, role) => {
  const isAuthor = await workRepository.isAuthor(workId, userId);

  // 어드민이 아니면 작성자만 수정할 수 있음
  if (role !== "ADMIN" && !isAuthor) {
    const error = new Error("작성자만 삭제할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  const result = await workRepository.hardDeleteWork(workId);
  if (result.challenge.isClosed) {
    const error = new Error(
      "완료된 첼린지에 대한 작업물은 삭제가 불가능합니다."
    );
    error.statusCode = 403;
    throw error;
  }

  // 알림 생성
  const challenge = await prisma.challenge.findUnique({
    where: { id: challengeId },
  });
  if (challenge && challenge.authorId !== userId) {
    const message = notificationService.notificationMessages.deleteWork(
      challenge.title
    );
    await notificationService.createNotification(challenge.authorId, message);
  }

  return result;
};

// 작업물에 좋아요를 추가하고 결과를 반환
const likeWork = async (workId, userId) => {
  if (!userId) {
    const error = new Error("사용자 아이디가 필요합니다.");
    error.statusCode = 400;
    throw error;
  }

  const work = await workRepository.findWorkById(workId);
  if (!work) {
    const error = new Error("해당 작업을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  const likedWork = await likeRepository.createLike(workId, userId);

  return likedWork;
};

// 작업물의 좋아요를 취소하고 결과를 반환
const unlikeWork = async (workId, userId) => {
  const hasLiked = await likeRepository.isWorkLikedByUser(workId, userId);
  if (!hasLiked) {
    const error = new Error("좋아요를 누른 사용자만 취소할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  const unlikedWork = await likeRepository.deleteLike(workId, userId);
  if (!unlikedWork) {
    const error = new Error("해당 작업을 찾을 수 없습니다.");
    error.statusCode = 404;
    throw error;
  }

  return unlikedWork;
};

export default {
  findAllWorks,
  getWorkById,
  getWorkByIdAtForm,
  isWorkDuplicate,
  createWork,
  updateWork,
  hardDeleteWork,
  likeWork,
  unlikeWork,
};
