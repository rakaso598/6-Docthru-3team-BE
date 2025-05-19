import likeRepository from "../repositories/like.repository.js";
import workRepository from "../repositories/work.repository.js";

const findAllWorks = async () => {
  const works = await workRepository.findAllWorks();

  return works;
};

const findWorkById = async (workId) => {
  const work = await workRepository.findWorkById(workId);

  return work;
};

const isWorkDuplicate = async (challengeId, authorId) => {
  const work = await workRepository.findWorkByChallengeIdAndAuthorId(
    challengeId,
    authorId
  );
  return work;
};

const createWork = async ({ title, content, challengeId, authorId }) => {
  const work = await workRepository.createWork({
    title,
    content,
    challengeId,
    authorId,
  });

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
