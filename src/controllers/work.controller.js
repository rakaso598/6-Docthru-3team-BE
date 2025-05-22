import workService from "../services/work.service.js";

// 현재 챌린지의 모든 work 조회
// page, pageSize 쿼리 파라미터로 페이지네이션 구현
// page는 1부터 시작 pageSize는 5개씩 조회
// 정렬은 좋아요순
export const getAllWorks = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { challengeId } = req.params;
    const { page = 1, pageSize = 5 } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "사용자 아이디가 필요합니다." });
    }

    const works = await workService.findAllWorks(
      userId,
      Number(challengeId),
      Number(page),
      Number(pageSize)
    );
    res.status(200).json({ data: works, pagination: { page, pageSize } });
  } catch (error) {
    console.error("Work 목록 조회 에러:", error);
    res.status(500).json({ message: "작업 목록을 불러오는데 실패했습니다." });
  }
};

// 특정 work 조회
export const getWorkById = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

    const work = await workService.findWorkById(Number(workId), userId);

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
    const { content } = req.body;
    const { challengeId } = req.params;

    const userId = req.user?.userId;

    if (!content || !challengeId || !userId) {
      return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
    }

    const isWorkDuplicate = await workService.isWorkDuplicate(
      Number(challengeId),
      userId
    );

    if (isWorkDuplicate) {
      return res.status(400).json({ message: "이미 작업물이 존재합니다." });
    }

    const newWork = await workService.createWork(
      content,
      Number(challengeId),
      userId
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

// work 하드삭제
export const hardDeleteWork = async (req, res) => {
  try {
    const { workId } = req.params;

    const existingWork = await workService.findWorkById(Number(workId));
    if (!existingWork) {
      return res.status(404).json({ message: "해당 작업을 찾을 수 없습니다." });
    }

    await workService.hardDeleteWork(Number(workId));
    res.status(204).send();
  } catch (error) {
    console.error("Work 하드 삭제 에러:", error);
    res.status(500).json({ message: "작업 하드 삭제에 실패했습니다." });
  }
};

// 작업물 좋아요
export const likeWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

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
    const userId = req.user?.userId;

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
