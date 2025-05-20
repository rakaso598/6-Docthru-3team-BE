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

const findChallengeById = async (challengeId) => {
  return await challengeRepository.findChallengeById(challengeId);
}

const updateChallenge = async (challengeId, data) => {
  return await challengeRepository.updateChallenge(challengeId, data);
}

const deleteChallenge = async (challengeId) => {
  return await challengeRepository.deleteChallenge(challengeId);
};

export default {
  create,
  findChallengeById,
  findAllChallenges,
  updateChallenge,
  deleteChallenge
};
