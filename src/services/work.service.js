import likeRepository from "../repositories/like.repository.js";
import workRepository from "../repositories/work.repository.js";

const findAllWorks = async (userId) => {
  const works = await workRepository.findAllWorks();

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

const findWorkById = async (workId, userId) => {
  const work = await workRepository.findWorkById(workId);

  const isLiked = await likeRepository.isWorkLikedByUser(workId, userId);

  return { ...work, isLiked };
};

const isWorkDuplicate = async (challengeId, authorId) => {
  const work = await workRepository.findWorkByChallengeIdAndAuthorId(
    challengeId,
    authorId
  );
  return work;
};

const createWork = async (content, challengeId, authorId) => {
  const work = await workRepository.createWork(content, challengeId, authorId);

  return work;
};

const updateWork = async (workId, { content }) => {
  const updatedWork = await workRepository.updateWork(workId, { content });

  return updatedWork;
};

const deleteWork = async (workId) => {
  await workRepository.deleteWork(workId);
};

const likeWork = async (workId, userId) => {
  const likedWork = await likeRepository.createLike(workId, userId);

  return likedWork;
};

const unlikeWork = async (workId, userId) => {
  const unlikedWork = await likeRepository.deleteLike(workId, userId);

  return unlikedWork;
};

export default {
  findAllWorks,
  findWorkById,
  isWorkDuplicate,
  createWork,
  updateWork,
  deleteWork,
  likeWork,
  unlikeWork,
};
