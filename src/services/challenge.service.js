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

export default {
  create,
};
