// challengeMocks.js
export const challengeMocks = [
  {
    id: 1,
    authorId: "admin1", // userMocks의 admin1 참조
    title: "TypeScript 고급 패턴 마스터하기",
    description:
      "타입스크립트의 깊이를 함께 탐구하며 견고한 코드를 작성해봅시다.",
    category: "TypeScript",
    docType: "블로그",
    originalUrl: "https://example.com/typescript-advanced-patterns",
    deadline: new Date("2025-06-15T23:59:59Z"),
    maxParticipant: 5,
    createdAt: new Date("2025-05-20T09:00:00Z"),
    updatedAt: new Date("2025-05-20T09:00:00Z"),
  },
  {
    id: 2,
    authorId: "admin2", // userMocks의 admin2 참조
    title: "프론트엔드 성능 최적화 A to Z",
    description:
      "웹 성능을 향상시키기 위한 다양한 기술들을 학습하고 적용합니다.",
    category: "Web",
    docType: "공식문서",
    originalUrl: "https://example.com/web-performance-guide",
    deadline: new Date("2025-06-20T23:59:59Z"),
    maxParticipant: 8,
    createdAt: new Date("2025-05-20T10:00:00Z"),
    updatedAt: new Date("2025-05-20T10:00:00Z"),
  },
  {
    id: 3,
    authorId: "admin3", // userMocks의 admin3 참조
    title: "클린 아키텍처 실전 적용",
    description:
      "소프트웨어 아키텍처의 기본 원칙을 이해하고 실제 프로젝트에 적용해봅니다.",
    category: "Architecture",
    docType: "책",
    originalUrl: "https://example.com/clean-architecture-book",
    deadline: new Date("2025-07-01T23:59:59Z"),
    maxParticipant: 6,
    createdAt: new Date("2025-05-20T11:00:00Z"),
    updatedAt: new Date("2025-05-20T11:00:00Z"),
  },
];
