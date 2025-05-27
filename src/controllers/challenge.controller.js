import challengeService from "../services/challenge.service.js";

//챌린지 작업물 관련

export const getAllChallenges = async (req, res) => {
  const { userId } = req.body;
  try {
    const works = await challengeService.findAllChallenges();
    res.status(200).json({ data: works });
  } catch (error) {
    console.error("Work 목록 조회 에러:", error);
    res.status(500).json({ message: "작업 목록을 불러오는데 실패했습니다." });
  }
};

//챌린지 생성

export const createChallenge = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const newChallenge = await challengeService.create(req.body, userId);

    return res.status(201).json(newChallenge);
  } catch (error) {
    next(error);
  }
};

// 챌린지 상세 조회
export const getChallengeById = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const challenge = await challengeService.getChallengeDetailById(
      Number(challengeId)
    );

    if (!challenge) {
      return res.status(404).json({ message: "챌린지를 찾을 수 없습니다." });
    }

    res.status(200).json({ data: challenge });
  } catch (error) {
    res.status(500).json({ message: "챌린지를 불러오는데 실패했습니다." });
  }
};

// 챌린지 수정
export const updateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const {
      title,
      description,
      category,
      docType,
      originalUrl,
      deadline,
      maxParticipant,
    } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    const challenge = await challengeService.findChallengeById(
      Number(challengeId)
    );
    if (!challenge) {
      return res
        .status(404)
        .json({ message: "해당 챌린지를 찾을 수 없습니다." });
    }

    if (challenge.authorId !== userId) {
      return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
    }

    const requiredFields = {
      title,
      description,
      category,
      docType,
      originalUrl,
      deadline,
      maxParticipant,
    };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ message: `${key} 값이 누락되었습니다.` });
      }
    }

    const updateData = {
      title,
      description,
      category,
      docType,
      originalUrl,
      deadline: new Date(deadline),
      maxParticipant: Number(maxParticipant),
    };

    const updateChallenge = await challengeService.updateChallenge(
      Number(challengeId),
      userId,
      updateData
    );

    res.status(200).json({ data: updateChallenge });
  } catch (error) {
    console.error(error); // 에러 상세 출력
    if (error.statusCode === 403) {
      return res.status(403).json({ message: "작성자만 수정할 수 있습니다." });
    }
    if (error.message === "NOT_FOUND") {
      return res
        .status(404)
        .json({ message: "해당 챌린지를 찾을 수 없습니다." });
    }
    res.status(500).json({ error, message: "챌린지 수정에 실패했습니다." });
  }
};

// 챌린지 삭제
export const deleteChallenge = async (req, res) => {
  try {
    const userId = req.auth?.userId;
    if (!userId) {
      return res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
    }

    const { challengeId } = req.params;
    await challengeService.deleteChallenge(Number(challengeId), userId);

    return res.status(200).send({ id: challengeId });
  } catch (error) {
    console.error(error);
    if (error.statusCode === 403) {
      return res.status(403).json({ message: error.message });
    }
    if (error.message === "챌린지가 존재하지 않습니다.") {
      return res.status(404).json({ message: error.message });
    }
    return res
      .status(500)
      .json({ error, message: "챌린지 삭제에 실패했습니다." });
  }
};

//챌린지 목록 조회

export const getChallenges = async (req, res, next) => {
  try {
    const challenges = await challengeService.getChallenges(req.query);

    return res.status(200).json(challenges);
  } catch (error) {
    next(error);
  }
};

/**
 * 챌린지 신청 관리(승인/거절/삭제)
 */
export async function updateApplicationStatus(req, res, next) {
  try {
    const challengeId = Number(req.params.challengeId);
    const data = req.body;
    const result = await challengeService.updateApplicationById(
      challengeId,
      data
    );
    res.json({ result });
  } catch (e) {
    next(e);
  }
}
