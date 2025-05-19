import prisma from "../client.prisma.js";
import { userMocks } from "./mocks/userMocks.js";
import { challengeMocks } from "./mocks/challengeMocks.js";
import { workMocks } from "./mocks/workMocks.js";

async function main() {
  // 기존 데이터 삭제
  await prisma.user.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.deleteMany();

  // 목 데이터 삽입
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
