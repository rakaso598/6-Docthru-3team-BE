import prisma from "../prisma/client.prisma.js";

export const getMyInfo = async (req, res) => {
  try {
    const userId = req.user.userId; // JWT에서 꺼낸 userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        grade: true,
        createdAt: true,
        //image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "유저를 찾을 수 없습니다." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("유저 조회 실패:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
};

export const getMyChallenges = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { myChallengeStatus, keyword } = req.query;

    let challenges = [];

    // 공통 키워드 필터
    const keywordFilter = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" } },
            { description: { contains: keyword, mode: "insensitive" } },
          ],
        }
      : {};

    if (myChallengeStatus === "applied") {
      // 신청한 챌린지
      const applications = await prisma.application.findMany({
        where: {
          authorId: userId,
          status: "PENDING",
          challenge: keywordFilter,
        },
        include: { challenge: true },
      });
      challenges = applications.map((a) => a.challenge);
    } else if (myChallengeStatus === "participated") {
      // 참여 중인 챌린지
      const now = new Date();
      const participants = await prisma.participant.findMany({
        where: {
          userId,
          challenge: {
            deadline: { gt: now },
            ...keywordFilter,
          },
        },
        include: { challenge: true },
      });
      challenges = participants.map((p) => p.challenge);
    } else if (myChallengeStatus === "completed") {
      // 완료한 챌린지
      const now = new Date();
      const participants = await prisma.participant.findMany({
        where: {
          userId,
          challenge: {
            deadline: { lte: now },
            ...keywordFilter,
          },
        },
        include: { challenge: true },
      });
      challenges = participants.map((p) => p.challenge);
    }

    res.status(200).json(challenges);
  } catch (error) {
    console.error("나의 챌린지 조회 실패:", error);
    res.status(500).json({ message: "서버 내부 오류" });
  }
};
