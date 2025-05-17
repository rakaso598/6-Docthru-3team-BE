const challenges = [
  {
    id: 1,
    title: "매일 30분 운동하기",
    description: "매일 30분 이상 운동하고 기록하기",
    startDate: "2025-05-18",
    endDate: "2025-06-18",
  },
  {
    id: 2,
    title: "책 1주일에 1권 읽기",
    description: "매주 책 한 권을 읽고 독서록 작성하기",
    startDate: "2025-05-18",
    endDate: "2025-12-31",
  },
];
let nextId = 3;

export const getAllChallenges = (req, res) => {
  res.status(200).json(challenges);
};

export const getChallengeById = (req, res) => {
  const id = parseInt(req.params.id);
  const challenge = challenges.find((c) => c.id === id);

  if (challenge) {
    res.status(200).json(challenge);
  } else {
    res.status(404).json({ message: "Challenge not found" });
  }
};

export const createChallenge = (req, res) => {
  const { title, description, startDate, endDate } = req.body;
  if (!title || !description || !startDate || !endDate) {
    return res.status(400).json({
      message: "Title, description, startDate, and endDate are required",
    });
  }

  const newChallenge = { id: nextId++, title, description, startDate, endDate };
  challenges.push(newChallenge);
  res.status(201).json(newChallenge);
};

export const updateChallenge = (req, res) => {
  const id = parseInt(req.params.id);
  const { title, description, startDate, endDate } = req.body;
  const challengeIndex = challenges.findIndex((c) => c.id === id);

  if (challengeIndex !== -1) {
    challenges[challengeIndex] = {
      ...challenges[challengeIndex],
      title,
      description,
      startDate,
      endDate,
    };
    res.status(200).json(challenges[challengeIndex]);
  } else {
    res.status(404).json({ message: "Challenge not found" });
  }
};

export const deleteChallenge = (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = challenges.length;
  challenges = challenges.filter((c) => c.id !== id);

  if (challenges.length < initialLength) {
    res.status(204).send(); // No Content
  } else {
    res.status(404).json({ message: "Challenge not found" });
  }
};
