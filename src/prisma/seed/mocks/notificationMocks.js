// notificationMocks.js
export const notificationMocks = [
  {
    id: 1,
    userId: "admin1", // admin1
    isRead: false,
    message:
      "새로운 챌린지 'TypeScript 고급 패턴 마스터하기'가 개설되었습니다.",
    createdAt: new Date("2025-05-20T10:00:00Z"),
    updatedAt: new Date("2025-05-20T10:00:00Z"),
  },
  {
    id: 2,
    userId: "admin2", // admin2
    isRead: false,
    message:
      "참여 중인 챌린지 '프론트엔드 성능 최적화 A to Z'에 새로운 작업물이 제출되었습니다.",
    createdAt: new Date("2025-05-22T12:00:00Z"),
    updatedAt: new Date("2025-05-22T12:00:00Z"),
  },
  {
    id: 3,
    userId: "admin3", // admin3
    isRead: true,
    message: "챌린지 '클린 아키텍처 실전 적용'에 새로운 참여 신청이 있습니다.",
    createdAt: new Date("2025-05-20T13:00:00Z"),
    updatedAt: new Date("2025-05-20T13:00:00Z"),
  },
];
