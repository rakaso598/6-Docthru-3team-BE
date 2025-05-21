import challengeService from "../services/challenge.service.js";

export const createChallenge = async (req, res, next) => {
  try {
    const { userId } = req.auth;

    const newChallenge = await challengeService.create(req.body, userId);

    return res.status(201).json(newChallenge);
  } catch (error) {
    next(error);
  }
};

export const getChallenges = async (req, res, next) => {
  try {
    const challenges = await challengeService.getChallenges(req.query);

    return res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
};
