import prisma from "../prisma/client.prisma.js";

// work 삭제
export const softDeleteWork = async (req, res) => {
  const { workId } = req.params;
  const { deletionReason } = req.body;

  try {
    // 작업물 조회
    const work = await prisma.work.findUnique({
      where: { id: parseInt(workId) },
      include: {
        challenge: {
          select: { isClosed: true },
        },
      },
    });

    // 작업물 존재 여부 확인
    if (!work) {
      return res.status(404).json({ message: "작업물을 찾을 수 없습니다." });
    }

    // 완료된 챌린지 여부 확인
    if (work.challenge.isClosed) {
      return res.status(403).json({
        message: "완료된 챌린지의 작업물은 삭제할 수 없습니다.",
      });
    }

    // 소프트 삭제 실행
    const result = await prisma.work.update({
      where: { id: parseInt(workId) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason: deletionReason,
      },
    });

    // 성공 응답
    res.status(200).json({
      message: "작업물이 성공적으로 삭제(비활성화)되었습니다.",
      work: result,
    });
  } catch (error) {
    console.error("작업물 삭제 중 오류 발생:", error);

    // Prisma NotFoundError (P2025) 처리
    if (error.code === "P2025") {
      return res.status(404).json({ message: "작업물을 찾을 수 없습니다." });
    }

    // 기타 에러 처리
    res.status(500).json({
      message: error.message || "서버 오류로 작업물을 삭제할 수 없습니다.",
    });
  }
};
