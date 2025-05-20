// export const getAllChallenges = (req, res) => {
//   res.status(200).json(challenges);
// };

import challengeService from "../services/challenge.service.js";

// export const getChallengeById = (req, res) => {
//   const id = parseInt(req.params.id);
//   const challenge = challenges.find((c) => c.id === id);

//   if (challenge) {
//     res.status(200).json(challenge);
//   } else {
//     res.status(404).json({ message: "Challenge not found" });
//   }
// };

export const createChallenge = async (req, res, next) => {
  const { userId } = req.auth;

  //디버깅
  console.log("userId", userId);

  const newChallenge = await challengeService.create(req.body, userId);

  return res.status(201).json(newChallenge);
};

// export const updateChallenge = (req, res) => {
//   const id = parseInt(req.params.id);
//   const { title, description, startDate, endDate } = req.body;
//   const challengeIndex = challenges.findIndex((c) => c.id === id);

//   if (challengeIndex !== -1) {
//     challenges[challengeIndex] = {
//       ...challenges[challengeIndex],
//       title,
//       description,
//       startDate,
//       endDate,
//     };
//     res.status(200).json(challenges[challengeIndex]);
//   } else {
//     res.status(404).json({ message: "Challenge not found" });
//   }
// };

// export const deleteChallenge = (req, res) => {
//   const id = parseInt(req.params.id);
//   const initialLength = challenges.length;
//   challenges = challenges.filter((c) => c.id !== id);

//   if (challenges.length < initialLength) {
//     res.status(204).send(); // No Content
//   } else {
//     res.status(404).json({ message: "Challenge not found" });
//   }
// };
