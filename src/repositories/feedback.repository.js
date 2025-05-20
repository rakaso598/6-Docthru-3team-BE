import prisma from "../prisma/client.prisma.js";

// 목록 조회
async function findByWorkId(workId) {
  return prisma.feedback.findMany({
    where: { workId: Number(workId) },
    orderBy: { createdAt: "desc" },
  });
}

// 등록
async function create(workId, authorId, content) {
  return prisma.feedback.create({
    data: { workId: Number(workId), authorId, content },
  });
}

// 수정
async function update(feedbackId, content) {
  return prisma.feedback.update({
    where: { id: Number(feedbackId) },
    data: { content },
  });
}

// 삭제
async function remove(feedbackId) {
  return prisma.feedback.delete({
    where: { id: Number(feedbackId) },
  });
}

export default { findByWorkId, create, update, remove };
