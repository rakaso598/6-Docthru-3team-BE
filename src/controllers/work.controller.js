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

    const works = await workService.findAllWorks(
      userId,
      Number(challengeId),
      Number(page),
      Number(pageSize)
    );
    res.status(200).json({ data: works, pagination: { page, pageSize } });
  } catch (error) {
    console.error("Work 목록 조회 에러:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "작업 목록을 불러오는데 실패했습니다.",
    });
  }
};

// 특정 work 조회
export const getWorkById = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

    const work = await workService.findWorkById(Number(workId), userId);
    res.status(200).json({ data: work });
  } catch (error) {
    if (error.statusCode === 403) {
      res.status(403).json({ message: error.message });
    } else {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "작업을 불러오는데 실패했습니다." });
    }
  }
};

// work 생성
export const createWork = async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.userId;

    await workService.isWorkDuplicate(Number(challengeId), userId);
    const newWork = await workService.createWork(Number(challengeId), userId);
    res.status(201).json({ data: newWork });
  } catch (error) {
    console.error("Work 생성 에러:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "작업 생성에 실패했습니다." });
  }
};

// work 제출 및 수정
export const updateWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { content } = req.body;
    const { userId, role } = req.user;

    const updatedWork = await workService.updateWork(
      Number(workId),
      userId,
      role,
      content
    );
    res.status(200).json({ data: updatedWork });
  } catch (error) {
    if (error.statusCode === 403) {
      res.status(403).json({ message: error.message });
    } else {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "작업 수정에 실패했습니다." });
    }
  }
};

// work 하드삭제
export const hardDeleteWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const { userId, role } = req.user;

    await workService.hardDeleteWork(Number(workId), userId, role);
    res.status(204).send();
  } catch (error) {
    if (error.statusCode === 403) {
      res.status(403).json({ message: error.message });
    } else {
      res
        .status(error.statusCode || 500)
        .json({ message: error.message || "작업 하드 삭제에 실패했습니다." });
    }
  }
};

// 작업물 좋아요
export const likeWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

    await workService.likeWork(Number(workId), userId);
    res.status(201).json({ message: "작업 좋아요 완료" });
  } catch (error) {
    console.error("Work 좋아요 에러:", error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "작업 좋아요에 실패했습니다." });
  }
};

// 작업물 좋아요 취소
export const unlikeWork = async (req, res) => {
  try {
    const { workId } = req.params;
    const userId = req.user?.userId;

    await workService.unlikeWork(Number(workId), userId);
    res.status(204).send();
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "작업 좋아요 취소에 실패했습니다." });
  }
};
