import prisma from "../prisma/client.prisma.js";

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      nickname: true,
      role: true,
      grade: true,
      createdAt: true,
    },
  });
};

/**
 * 특정 상태에 따라 사용자의 챌린지 목록을 조회하는 함수
 *
 * @param userId - 사용자 ID
 * @param status - "participated" | "completed" | "applied" 중 하나
 * @param keywordFilter - 카테고리, 문서 타입 등의 필터 조건
 * @param options - 페이지네이션 및 검색어 등 (page, pageSize, category, docType, keyword)
 * @returns { data: Challenge[], totalCount: number, currentPage: number, pageSize: number }
 */
export const findMyChallengesByStatus = async (
  userId,
  status,
  keywordFilter = {},
  options = {}
) => {
  const now = new Date();

  // 옵션 기본값 처리
  const {
    page = 1,
    pageSize = 10,
    category,
    docType,
    keyword,
  } = options;

  const skip = (Number(page) - 1) * Number(pageSize); // 건너뛸 수
  const take = Number(pageSize); // 가져올 수

  // 키워드 검색 조건 (제목 또는 설명에 포함되는 경우)
  const baseKeywordFilter = keyword
    ? {
        OR: [
          { title: { contains: keyword, mode: "insensitive" } },
          { description: { contains: keyword, mode: "insensitive" } },
        ],
      }
    : {};

  /**
   * 상태별 분기: 진행중 챌린지 참여, 완료된 챌린지 참여
   */
  if (status === "participated" || status === "completed") {
    const challengeWhere = {
      ...(status === "participated"
        ? { deadline: { gt: now } } // 마감일이 현재보다 이후 → 진행중
        : { deadline: { lte: now } }), // 마감일이 현재 이전 → 완료
      ...keywordFilter,
      ...baseKeywordFilter,
    };

    // 총 개수 + 목록 병렬 조회
    const [totalCount, participants] = await Promise.all([
      prisma.participant.count({
        where: {
          userId,
          challenge: challengeWhere,
        },
      }),
      prisma.participant.findMany({
        where: {
          userId,
          challenge: challengeWhere,
        },
        skip,
        take,
        orderBy: {
          challenge: { createdAt: "desc" }, // 최신순 정렬
        },
        include: {
          challenge: {
            include: {
              participants: true,
              application: {
                select: {
                  adminStatus: true,
                  appliedAt: true,
                },
              },
            },
          },
        },
      }),
    ]);

    // 참가자 레코드 → 챌린지만 추출
    const challenges = participants.map((p) => p.challenge);

    return {
      data: challenges,
      totalCount,
      currentPage: Number(page),
      pageSize: Number(pageSize),
    };
  }

  /**
   * 내가 만든 챌린지 조회 (created or applied)
   */
  if (status === "applied") {
    const where = {
      authorId: userId, // 내가 만든 챌린지
      ...keywordFilter,
      ...baseKeywordFilter,
    };

    if (category) where.category = category;
    if (docType) where.docType = docType;

    const [totalCount, challenges] = await Promise.all([
      prisma.challenge.count({ where }),
      prisma.challenge.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          participants: true,
          application: {
            select: {
              adminStatus: true,
              appliedAt: true,
            },
          },
        },
      }),
    ]);

    return {
      data: challenges,
      totalCount,
      currentPage: Number(page),
      pageSize: Number(pageSize),
    };
  }

  // 유효하지 않은 status 처리
  const error = new Error("올바르지 않은 상태입니다.");
  error.status = 400;
  throw error;
};

export const findMyApplication = async (applicationId) => {
  return await prisma.application.findUnique({
    where: {
      id: applicationId,
    },
    include: {
      challenge: true,
    },
  });
};

export const findMyCreatedChallenges = async (
  userId,
  keywordFilter,
  options = {}
) => {
  const { page = 1, pageSize = 10, category, docType, keyword } = options;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const where = {
    authorId: userId,
    ...keywordFilter,
  };

  if (category) {
    where.category = category;
  }

  if (docType) {
    where.docType = docType;
  }

  if (keyword) {
    where.OR = [
      { title: { contains: keyword, mode: "insensitive" } },
      { description: { contains: keyword, mode: "insensitive" } },
    ];
  }

  const [totalCount, challenges] = await Promise.all([
    prisma.challenge.count({ where }),
    prisma.challenge.findMany({
      where,
      skip,
      take,
      orderBy: {
        createdAt: "desc", // 최신순 정렬
      },
      include: {
        participants: true, // 관계 포함
        application: {
          select: {
            adminStatus: true,
            appliedAt: true,
          },
        },
      },
    }),
  ]);

  return {
    data: challenges,
    totalCount,
    currentPage: Number(page),
    pageSize: Number(pageSize),
  };
};
