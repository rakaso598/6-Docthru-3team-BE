import workService from "../services/work.service.js";

// TODO : 아직 토큰로직은 안넣음

// 모든 work 조회
export const getAllWorks = async (req, res) => {
  try {
    // TODO: 나중에 토큰에서 userId를 가져와야 함
    const { userId } = req.body; // 임시로 body에서 받아옴

    if (!userId) {
      return res.status(400).json({ message: "사용자 아이디가 필요합니다." });
    }

    const works = await workService.findAllWorks(userId);
    res.status(200).json({ data: works });
  } catch (error) {
    console.error("Work 목록 조회 에러:", error);
    res.status(500).json({ message: "작업 목록을 불러오는데 실패했습니다." });
  }
};

// 특정 work 조회
export const getWorkById = async (req, res) => {
  try {
    const { workId } = req.params;
    const work = await workService.findWorkById(Number(workId));

    if (!work) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    res.status(200).json({ data: work });
  } catch (error) {
    res.status(500).json({ message: "작업을 불러오는데 실패했습니다." });
  }
};

// work 생성
export const createWork = async (req, res) => {
  try {
    // TODO : authorId는 추후 토큰으로 변경
    const { content, authorId } = req.body;
    const { challengeId } = req.params;

    // TODO : 나중에 토큰적용시 주석 해제
    // if (!content || !challengeId || !authorId) {
    //   return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
    // }

    const isWorkDuplicate = await workService.isWorkDuplicate(
      Number(challengeId),
      authorId
    );

    if (isWorkDuplicate) {
      return res.status(400).json({ message: "이미 작업물이 존재합니다." });
    }

    const newWork = await workService.createWork(
      content,
      Number(challengeId),
      authorId
    );

    res.status(201).json({ data: newWork });
  } catch (error) {
    console.error("Work 생성 에러:", error);
    res.status(500).json({ message: "작업 생성에 실패했습니다." });
  }
};

// work 수정
export const updateWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "수정할 내용을 입력해주세요." });
    }

    const updatedWork = await workService.updateWork(Number(workId), {
      content,
    });

    if (!updatedWork) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    res.status(200).json({ data: updatedWork });
  } catch (error) {
    res.status(500).json({ message: "작업 수정에 실패했습니다." });
  }
};

// // work 삭제
// export const deleteWork = async (req, res) => {
//   const { workId } = req.params;
//   const { deletionReason } = req.body; // PATCH 요청의 BODY에서 삭제 사유를 받습니다.

//   // 삭제 사유가 없을 경우, 400 Bad Request 응답
//   if (!deletionReason) {
//     return res.status(400).json({ message: "삭제 사유를 입력해주세요." });
//   }

//   try {
//     // 여기에 workId와 deletionReason을 사용하여 데이터베이스에서 작업물을 "삭제" 또는 "비활성화"하는 로직을 구현합니다.
//     // (예: isDeleted 플래그 업데이트, deletedAt 및 deletionReason 저장)
//     const result = await prisma.work.update({
//       // Prisma 예시
//       where: { id: parseInt(workId), isDeleted: false },
//       data: {
//         isDeleted: true,
//         deletedAt: new Date(),
//         deletionReason: deletionReason,
//       },
//     });

//     if (!result) {
//       return res
//         .status(404)
//         .json({ message: "해당 작업물을 찾을 수 없거나 이미 삭제되었습니다." });
//     }

//     res
//       .status(200)
//       .json({
//         message: "작업물이 성공적으로 삭제(비활성화)되었습니다.",
//         work: result,
//       });
//   } catch (error) {
//     console.error("작업물 삭제 중 오류 발생:", error);
//     res
//       .status(500)
//       .json({ message: "서버 오류로 작업물을 삭제할 수 없습니다." });
//   }
// };

// 작업물 좋아요
export const likeWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "사용자 아이디가 필요합니다." });
    }

    const likedWork = await workService.likeWork(Number(workId), userId);

    console.log("likedWork", likedWork);

    if (!likedWork) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    res.status(201).json({ message: "작업 좋아요 완료" });
  } catch (error) {
    console.error("Work 좋아요 에러:", error);
    res.status(500).json({ message: "작업 좋아요에 실패했습니다." });
  }
};

// 작업물 좋아요 취소
export const unlikeWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "사용자 아이디가 필요합니다." });
    }

    const unlikedWork = await workService.unlikeWork(Number(workId), userId);

    if (!unlikedWork) {
      return res.status(404).send();
    }

    res.status(204).json({ message: "작업 좋아요 취소 완료" });
  } catch (error) {
    res.status(500).json({ message: "작업 좋아요 취소에 실패했습니다." });
  }
};
