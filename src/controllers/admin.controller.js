import prisma from "../prisma/client.prisma.js";

// work 삭제
export const softDeleteWork = async (req, res) => {
  const { workId } = req.params;
  const { deletionReason } = req.body; // PATCH 요청의 BODY에서 삭제 사유를 받습니다.

  // 삭제 사유가 없을 경우, 400 Bad Request 응답
  if (!deletionReason) {
    return res.status(400).json({ message: "삭제 사유를 입력해주세요." });
  }

  try {
    // 여기에 workId와 deletionReason을 사용하여 데이터베이스에서 작업물을 "삭제" 또는 "비활성화"하는 로직을 구현합니다.
    // (예: isDeleted 플래그 업데이트, deletedAt 및 deletionReason 저장)
    const result = await prisma.work.update({
      // Prisma 예시
      where: { id: parseInt(workId) },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletionReason: deletionReason,
      },
    });

    if (!result) {
      return res
        .status(404)
        .json({ message: "해당 작업물을 찾을 수 없거나 이미 삭제되었습니다." });
    }

    res.status(200).json({
      message: "작업물이 성공적으로 삭제(비활성화)되었습니다.",
      work: result,
    });
  } catch (error) {
    console.error("작업물 삭제 중 오류 발생:", error);
    res
      .status(500)
      .json({ message: "서버 오류로 작업물을 삭제할 수 없습니다." });
  }
};
