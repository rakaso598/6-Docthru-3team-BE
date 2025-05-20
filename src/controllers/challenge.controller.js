import challengeService from "../services/challenge.service.js";


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


export const createChallenge = async (req, res, next) => {
  const { userId } = req.auth;

  //디버깅
  console.log("userId", userId);

  const newChallenge = await challengeService.create(req.body, userId);

  return res.status(201).json(newChallenge);
};

// 챌린지 상세 조회
export const getChallengeById = async (req, res) => {

  try {
    const { challengeId } = req.params;
    const challenge = await challengeService.findChallengeById(Number(challengeId));

    if (!challenge) {
      return res.status(404).json({ message: "챌린지를 찾을 수 없습니다." });
    } 

    res.status(200).json({ data: challenge })
  } catch (error) {
    res.status(500).json({ message: "챌린지를 불러오는데 실패했습니다." });
  }
};


// 챌린지 수정
export const updateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const { title, description, category, docType, originalUrl, deadline, maxParticipant  } = req.body;

    if (!req.headers.authorization) {
     return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
    }

    if(!title || !description || !category || !docType || !originalUrl || !deadline || !maxParticipant) {
      return res.status(400).json({ message: "수정할 내용을 입력해주세요"});
    }

    const updateChallenge = await challengeService.updateChallenge(Number(challengeId), {
      title,
      description,
      category, 
      docType, 
      originalUrl, 
      deadline, 
      maxParticipant 
    })

    if(!updateChallenge) {
      return res.status(404).json({ message: "해당 챌린지를 찾을 수 없습니다." });
    }

    res.status(200).json({ data: updateChallenge });
  } catch (error) {
    console.error(error);  // 에러 상세 출력
    res.status(500).json({ message: "챌린지 수정에 실패했습니다." });
  }
};


// 챌린지 삭제
export const deleteChallenge = async (req, res) => {
  if (!req.headers.authorization) {
     return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
  }
  try {
    const { challengeId } = req.params;
    await challengeService.deleteChallenge(Number(challengeId));
    res.status(204).send({challengeId});
  } catch (error) {
    res.status(500).json({ error, message: "챌린지 삭제에 실패했습니다." });
  }
};
