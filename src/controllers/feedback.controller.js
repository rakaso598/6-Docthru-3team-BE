import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 특정 작업물(Work)에 대한 모든 피드백 조회 (GET /works/:workId/feedbacks)
export const getFeedbacksByWorkId = async (req, res) => {
  const { workId } = req.params; // workId는 상위 라우터에서 mergeParams로 넘어옴

  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        workId: parseInt(workId), // workId는 문자열로 넘어오므로 숫자로 변환
      },
      include: {
        // 피드백 작성자 정보도 함께 가져오고 싶다면
        user: {
          select: {
            id: true,
            nickname: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc", // 오래된 피드백부터 정렬
      },
    });

    res.status(200).json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "피드백을 불러오는 데 실패했습니다." });
  }
};

// 새로운 피드백 생성 (POST /works/:workId/feedbacks)
// (사용자 인증 후 req.user 또는 req.auth에 사용자 정보가 있다고 가정)
export const createFeedback = async (req, res) => {
  const { workId } = req.params;
  const { content } = req.body;
  // 실제 애플리케이션에서는 인증 미들웨어를 통해 사용자 ID를 가져와야 합니다.
  // 예: const authorId = req.user.id; 또는 const authorId = req.auth.id;
  const authorId = req.user?.id || "clx8k4y7n0000y81g9b2i2m1c"; // 예시용 더미 ID, 실제는 인증 미들웨어에서 가져옴

  if (!content) {
    return res.status(400).json({ message: "피드백 내용은 필수입니다." });
  }

  try {
    const newFeedback = await prisma.feedback.create({
      data: {
        work: { connect: { id: parseInt(workId) } },
        user: { connect: { id: authorId } },
        content,
      },
      include: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "피드백 생성에 실패했습니다." });
  }
};

// 특정 피드백 조회 (GET /feedbacks/:id 또는 /works/:workId/feedbacks/:feedbackId)
export const getFeedbackById = async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: parseInt(feedbackId),
      },
      include: {
        work: {
          select: {
            id: true,
            content: true, // <--- Work 모델에 'title' 대신 'content' 필드를 선택하도록 수정
          },
        },
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });

    if (!feedback) {
      return res.status(404).json({ message: "피드백을 찾을 수 없습니다." });
    }

    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "피드백을 불러오는 데 실패했습니다." });
  }
};

// 피드백 수정 (PATCH /feedbacks/:id 또는 /works/:workId/feedbacks/:feedbackId)
// (사용자 본인이 작성한 피드백만 수정 가능하도록 로직 추가 필요)
export const updateFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  const { content } = req.body;
  // 실제 애플리케이션에서는 인증 미들웨어를 통해 사용자 ID를 가져와야 합니다.
  const currentUserId = req.user?.id || "clx8k4y7n0000y81g9b2i2m1c"; // 예시용 더미 ID

  if (!content) {
    return res.status(400).json({ message: "피드백 내용은 필수입니다." });
  }

  try {
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: parseInt(feedbackId) },
    });

    if (!existingFeedback) {
      return res.status(404).json({ message: "피드백을 찾을 수 없습니다." });
    }

    // 작성자만 수정할 수 있도록 검증
    if (existingFeedback.authorId !== currentUserId) {
      return res
        .status(403)
        .json({ message: "이 피드백을 수정할 권한이 없습니다." });
    }

    const updatedFeedback = await prisma.feedback.update({
      where: {
        id: parseInt(feedbackId),
      },
      data: {
        content,
      },
      include: {
        user: { select: { id: true, nickname: true } },
      },
    });

    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "피드백 수정에 실패했습니다." });
  }
};

// 피드백 삭제 (DELETE /feedbacks/:id 또는 /works/:workId/feedbacks/:feedbackId)
// (사용자 본인이 작성한 피드백 또는 관리자만 삭제 가능하도록 로직 추가 필요)
export const deleteFeedback = async (req, res) => {
  const { feedbackId } = req.params;
  // 실제 애플리케이션에서는 인증 미들웨어와 역할(role)을 통해 사용자 ID를 가져와야 합니다.
  const currentUserId = req.user?.id || "clx8k4y7n0000y81g9b2i2m1c"; // 예시용 더미 ID
  const currentUserRole = req.user?.role || "USER"; // 예시용 더미 역할

  try {
    const existingFeedback = await prisma.feedback.findUnique({
      where: { id: parseInt(feedbackId) },
    });

    if (!existingFeedback) {
      return res.status(404).json({ message: "피드백을 찾을 수 없습니다." });
    }

    // 작성자 또는 관리자만 삭제할 수 있도록 검증
    if (
      existingFeedback.authorId !== currentUserId &&
      currentUserRole !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ message: "이 피드백을 삭제할 권한이 없습니다." });
    }

    await prisma.feedback.delete({
      where: {
        id: parseInt(feedbackId),
      },
    });

    res.status(204).send(); // No Content
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "피드백 삭제에 실패했습니다." });
  }
};
