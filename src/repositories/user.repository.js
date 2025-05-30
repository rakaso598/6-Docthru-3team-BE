import prisma from "../prisma/client.prisma.js";
import { getInitial } from "../utils/initial.utils.js";

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

export async function findMyChallenges(options, userId) {
  const { pageSize = 4, cursor, category, docType, keyword, status } = options;

  const take = Number(pageSize);
  const where = {
    application: {
      adminStatus: "ACCEPTED",
    },
    participants: {
      some: {
        userId: userId,
      },
    },
  };

  if (category) where.category = category;
  if (docType) where.docType = docType;

  let myChallenges = await prisma.challenge.findMany({
    take: take + 1, // 다음 페이지 여부 확인용
    ...(cursor && {
      cursor: {
        id: Number(cursor),
      },
      skip: 1,
    }),
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

  // 키워드 필터링
  if (keyword) {
    const keywordNoSpace = keyword.replace(/\s/g, "").toLowerCase();
    const keywordInitial = getInitial(keywordNoSpace);

    myChallenges = myChallenges.filter((challenge) => {
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

  // status 필터링
  const challengesWithStatus = myChallenges.map((challenge) => {
    const now = new Date();
    const isDeadlinePassed = new Date(challenge.deadline) <= now;
    const participantCount = Array.isArray(challenge.participants)
      ? challenge.participants.length
      : 0;
    const isFull = participantCount >= challenge.maxParticipant;

    let status;
    if (isDeadlinePassed) {
      status = "closed";
    } else if (isFull) {
      status = "full";
    } else {
      status = "open";
    }

    return {
      ...challenge,
      status,
    };
  });

  const statusFiltered = status
    ? challengesWithStatus.filter((c) => c.status === status)
    : challengesWithStatus;

  const hasNextPage = statusFiltered.length > take;
  const slicedData = statusFiltered.slice(0, take);

  return {
    challenges: slicedData,
    nextCursor: hasNextPage ? slicedData[slicedData.length - 1].id : null,
  };
}
