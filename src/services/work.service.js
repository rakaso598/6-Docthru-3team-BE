import challengeRepository from "../repositories/challenge.repository.js";
import likeRepository from "../repositories/like.repository.js";
import workRepository from "../repositories/work.repository.js";
import prisma from "../prisma/client.prisma.js";

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
const findWorkById = async (workId, userId) => {
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

  return result;
};

// 작업물 내용을 수정하고 수정된 작업물을 반환 (작성자 권한 확인 포함)
const updateWork = async (workId, userId, content) => {
  if (!content) {
    const error = new Error("수정할 내용을 입력해주세요.");
    error.statusCode = 400;
    throw error;
  }

  const isAuthor = await workRepository.isAuthor(workId, userId);

  if (!isAuthor) {
    const error = new Error("작성자만 수정할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  const updatedWork = await workRepository.updateWork(workId, content);

  return updatedWork;
};

// 작업물을 영구적으로 삭제
const hardDeleteWork = async (workId, userId) => {
  const isAuthor = await workRepository.isAuthor(workId, userId);

  if (!isAuthor) {
    const error = new Error("작성자만 삭제할 수 있습니다.");
    error.statusCode = 403;
    throw error;
  }

  const result = await workRepository.hardDeleteWork(workId);

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
  const isAuthor = await workRepository.isAuthor(workId, userId);
  if (!isAuthor) {
    const error = new Error("작성자만 좋아요 취소할 수 있습니다.");
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
  findWorkById,
  isWorkDuplicate,
  createWork,
  updateWork,
  hardDeleteWork,
  likeWork,
  unlikeWork,
};
