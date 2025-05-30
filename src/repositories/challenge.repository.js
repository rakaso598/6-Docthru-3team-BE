import prisma from "../prisma/client.prisma.js";

/**
 * 챌린지 등록 및 자동 신청
 */
async function save(challenge, userId) {
  return await prisma.$transaction(async (tx) => {
    const createdChallenge = await tx.challenge.create({
      data: {
        authorId: userId,
        title: challenge.title,
        description: challenge.description,
        category: challenge.category,
        docType: challenge.docType,
        originalUrl: challenge.originalUrl,
        deadline: challenge.deadline,
        maxParticipant: challenge.maxParticipant,
      },
    });

    const createdApplication = await tx.application.create({
      data: {
        authorId: userId,
        challengeId: createdChallenge.id,
        appliedAt: new Date(),
      },
    });

    return { createdChallenge, createdApplication };
  });
}

// 승인된 챌린지 전체 조회 (추후 사용 예정)
const findAllChallenges = async () => {
  return await prisma.challenge.findMany({
    where: {
      application: {
        adminStatus: "ACCEPTED",
      },
    },
    include: {
      participants: true,
    },
  });
};

// 특정 challenge 조회 (상세 조회에 활용)
const findChallengeDetailById = async (challengeId) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      user: {
        select: {
          id: true,
          nickname: true,
        },
      },
    },
  });
};
// 특정 challenge 조회  (수정, 삭제에 활용)
const findChallengeById = async (challengeId) => {
  return await prisma.challenge.findUnique({
    where: { id: challengeId },
    select: { id: true, authorId: true, title: true },
  });
};

// 사용자 역할 조회
const findUserRoleById = async (userId) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
};

// challenge update
const updateChallenge = async (challengeId, updateData) => {
  return await prisma.challenge.update({
    where: { id: challengeId },
    data: updateData,
  });
};

// 관리자 - 신청 상태 업데이트
const updateApplication = async (challengeId, updateData) => {
  const data = { ...updateData };

  if (["REJECTED", "DELETED"].includes(updateData.adminStatus)) {
    data.invalidatedAt = new Date();
  }

  return await prisma.application.update({
    where: { challengeId },
    data,
  });
};

const deleteChallengeById = async (challengeId) => {
  await prisma.application.deleteMany({
    where: {
      challengeId: challengeId, // 해당 챌린지를 참조하는 모든 신청 삭제
    },
  });

  await prisma.challenge.delete({
    where: { id: challengeId },
  });
};

// 한글 초성 리스트
const initial = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 한글 문자열에서 초성만 추출
function getInitial(str) {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // 한글 유니코드 범위: 가 ~ 힣
      if (code >= 44032 && code <= 55203) {
        const initialIndex = Math.floor((code - 44032) / 588);
        return initial[initialIndex];
      }
      return char; // 한글 아닌 문자는 그대로
    })
    .join("");
}

//챌린지 목록 가져오기
async function getChallenges(options) {
  const {
    page = 1,
    pageSize = 10,
    category,
    docType,
    keyword,
    status,
  } = options;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {};

  if (category) {
    if (Array.isArray(category)) {
      where.category = {
        in: category,
      };
    } else {
      where.category = category;
    }
  }

  if (docType) {
    where.docType = docType;
  }

  //데이터의 총 갯수(챌린지 상태는 제외되어있음)
  let allChallenges = await prisma.challenge.findMany({
    where,
    include: {
      participants: true,
      application: {
        select: {
          adminStatus: true,
          appliedAt: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (keyword) {
    const keywordNoSpace = keyword.replace(/\s/g, "").toLowerCase();
    const keywordInitial = getInitial(keywordNoSpace);

    allChallenges = allChallenges.filter((challenge) => {
      const title = challenge.title || "";
      const desc = challenge.description || "";

      const normalizedTitle = title.replace(/\s/g, "").toLowerCase();
      const normalizedDesc = desc.replace(/\s/g, "").toLowerCase();

      const titleChosung = getInitial(normalizedTitle);
      const descChosung = getInitial(normalizedDesc);

      return (
        normalizedTitle.includes(keywordNoSpace) ||
        normalizedDesc.includes(keywordNoSpace) ||
        titleChosung.includes(keywordInitial) ||
        descChosung.includes(keywordInitial)
      );
    });
  }

  // status(챌린지의 진행 중, 마감 상태)를 포함하여 필터링
  const challengesWithStatus = allChallenges.map((challenge) => {
    const status =
      challenge.participants.length >= challenge.maxParticipant ||
      new Date(challenge.deadline) <= new Date()
        ? "closed"
        : "open";

    return {
      ...challenge,
      status,
    };
  });

  //최종적인 챌린지 데이터
  const statusFilterdChallenges = status
    ? challengesWithStatus.filter((c) => c.status === status)
    : challengesWithStatus;

  //모든 챌린지 데이터에서 페이지네이션으로 자르기
  const pagedChallenges = statusFilterdChallenges.slice(skip, skip + take);

  return {
    totalCount: statusFilterdChallenges.length,
    currentPage: Number(page),
    pageSize: Number(pageSize),
    data: pagedChallenges,
  };
}

async function findAllApplications(options) {
  const { skip, take, where, orderBy } = options;

  const [totalCount, applications] = await Promise.all([
    prisma.application.count({ where }),
    prisma.application.findMany({
      where,
      orderBy,
      skip,
      take,
      include: {
        challenge: {
          include: { participants: true },
        },
      },
    }),
  ]);

  return {
    totalCount,
    data: applications,
  };
}

export default {
  save,
  getChallenges,
  findAllChallenges,
  findAllApplications,
  findUserRoleById,
  findChallengeById,
  updateChallenge,
  updateApplication,
  deleteChallengeById,
  findChallengeDetailById,
};
