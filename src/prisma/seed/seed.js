import prisma from "../client.prisma.js";
import { userMocks } from "./mocks/userMocks.js";
import { challengeMocks } from "./mocks/challengeMocks.js";
import { workMocks } from "./mocks/workMocks.js";
import { applicationMocks } from "./mocks/applicationMocks.js";
import { feedbackMocks } from "./mocks/feedbackMocks.js";
import { participantMocks } from "./mocks/participantMocks.js";
import { likeMocks } from "./mocks/likeMocks.js";
import { notificationMocks } from "./mocks/notificationMocks.js";

async function main() {
  // 기존 데이터 삭제 (여기에 한줄씩 추가하세요)
  await prisma.user.deleteMany(); // 1
  await prisma.challenge.deleteMany(); // 2
  await prisma.work.deleteMany(); // 3
  await prisma.application.deleteMany(); // 4
  await prisma.feedback.deleteMany(); // 5
  await prisma.participant.deleteMany(); // 6
  await prisma.like.deleteMany(); // 7
  await prisma.notification.deleteMany(); // 8

  // 목 데이터 삽입 (여기에 한블럭씩 추가하세요)
  await prisma.user.createMany({
    data: userMocks,
    skipDuplicates: true,
  });
  await prisma.challenge.createMany({
    data: challengeMocks,
    skipDuplicates: true,
  });
  await prisma.work.createMany({
    data: workMocks,
    skipDuplicates: true,
  });
  await prisma.application.createMany({
    data: applicationMocks,
    skipDuplicates: true,
  });
  await prisma.feedback.createMany({
    data: feedbackMocks,
    skipDuplicates: true,
  });
  await prisma.participant.createMany({
    data: participantMocks,
    skipDuplicates: true,
  });
  await prisma.like.createMany({
    data: likeMocks,
    skipDuplicates: true,
  });
  await prisma.notification.createMany({
    data: notificationMocks,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
