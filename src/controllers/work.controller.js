import workService from "../services/work.service.js";

// TODO : 아직 토큰로직은 안넣음

// 모든 work 조회
export const getAllWorks = async (req, res) => {
  try {
    const works = await workService.findAllWorks();
    res.status(200).json({ data: works });
  } catch (error) {
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

    if (!content || !challengeId || !authorId) {
      return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
    }

    const isWorkDuplicate = await workService.isWorkDuplicate(
      Number(challengeId),
      authorId
    );

    if (isWorkDuplicate) {
      return res.status(400).json({ message: "이미 작업물이 존재합니다." });
    }
    const newWork = await workService.createWork({
      content,
      challengeId: Number(challengeId),
      authorId,
    });

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

// work 삭제
export const deleteWork = async (req, res) => {
  try {
    const { workId } = req.params;
    await workService.deleteWork(Number(workId));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "작업 삭제에 실패했습니다." });
  }
};

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
