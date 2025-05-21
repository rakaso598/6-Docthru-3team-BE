import challengeRepository from "../repositories/challenge.repository.js";
import verify from "../middlewares/verify.js";

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
    verify.throwBadRequestError();
  }

  const newChallenge = await challengeRepository.save(challenge, userId);

  if (!newChallenge) throw new Error("Failed create newChallenge");

  return newChallenge;
}

async function getAll() {
  return challengeRepository.getAll();
}

export default {
  create,
  getAll,
};
