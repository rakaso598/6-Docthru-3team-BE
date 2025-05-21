import challengeRepository from "../repositories/challenge.repository.js";
import verify from "../middlewares/verify.js";

async function create(challenge, userId) {
  const {
    title,
    description,
    category,
    docType,
    originalUrl,
    deadline,
    maxParticipant,
  } = challenge;

  //디버깅
  console.log(
    userId,
    title,
    description,
    category,
    docType,
    originalUrl,
    deadline,
    maxParticipant
  );

  if (
    !userId ||
    !title ||
    !description ||
    !category ||
    !docType ||
    !originalUrl ||
    !deadline ||
    !maxParticipant
  ) {
    verify.throwBadRequestError();
  }

  const newChallenge = await challengeRepository.save(challenge, userId);

  if (!newChallenge) throw new Error("Failed create newChallenge");

  return newChallenge;
}

const findAllChallenges = async () => {
  return await challengeRepository.findAllChallenges();
}

// 게시글 상세 조회
const getChallengeDetailById = async (challengeId) => {
  return await challengeRepository.findChallengeDetailById(challengeId);
};

// 게시글 수정 삭제
const findChallengeById = async (challengeId) => {
  return await challengeRepository.findChallengeById(challengeId);
}

const updateChallenge = async (challengeId, userId, data) => {
  const challenge = await challengeRepository.findChallengeById(challengeId);
  if(!challenge) throw new Error("챌린지가 존재하지 않습니다.");

  if(challenge.authorId !== userId){
    const err = new Error("작성자만 수정할 수 있습니다.");
    err.statusCode = 403;
    throw err;
  }

  return await challengeRepository.updateChallenge(challengeId, data);
}

const deleteChallenge = async (challengeId, userId) => {
  const challenge = await challengeRepository.findChallengeById(challengeId);
  if(!challenge) {
    throw new Error("챌린지가 존재하지 않습니다.");
  }

  if(challenge.authorId !== userId) {
    const err = new Error("작성자만 삭제할 수 있습니다.");
    err.statusCode = 403;
    throw err;
  }
  await challengeRepository.deleteChallengeById(challengeId);
};

export default {
  create,
  findChallengeById,
  findAllChallenges,
  updateChallenge,
  deleteChallenge,
  getChallengeDetailById
};
