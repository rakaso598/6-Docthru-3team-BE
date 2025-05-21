// applicationMocks.js
export const applicationMocks = [
  {
    id: 1,
    authorId: "admin1", // admin1
    challengeId: 1, // Challenge 1 (다른 챌린지)
    adminStatus: "ACCEPTED",
    adminMessage: "참여를 승인합니다.",
    invalidatedAt: null,
    appliedAt: new Date("2025-05-20T10:30:00Z"),
  },
  {
    id: 2,
    authorId: "admin2", // admin2
    challengeId: 2, // Challenge 2 (다른 챌린지)
    adminStatus: "PENDING",
    adminMessage: null,
    invalidatedAt: null,
    appliedAt: new Date("2025-05-20T11:30:00Z"),
  },
  {
    id: 3,
    authorId: "admin3", // admin3
    challengeId: 3, // Challenge 3 (다른 챌린지)
    adminStatus: "PENDING",
    adminMessage: null,
    invalidatedAt: null,
    appliedAt: new Date("2025-05-20T12:30:00Z"),
  },
];
