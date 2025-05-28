import challengeRepository from "../repositories/challenge.repository.js";
import notificationService from "../services/notification.service.js";

// 1시간마다 모든 챌린지 데드라인 체크
let isChecking = false;

async function checkAllChallengesDeadlines() {
  if (isChecking) return;
  isChecking = true;

  try {
    const challenges = await challengeRepository.findAllChallenges();

    for (const challenge of challenges) {
      try {
        const currentTime = new Date();
        if (challenge.deadline <= currentTime) {
          // 챌린지 작성자 알림
          const message = notificationService.notificationMessages.challengeEnd(
            challenge.title
          );
          await notificationService.createNotification(
            challenge.authorId,
            message
          );

          // 참여자들 알림
          if (challenge.participants) {
            for (const participant of challenge.participants) {
              await notificationService.createNotification(
                participant.userId,
                message
              );
            }
          }
        }
      } catch (error) {
        console.error(`챌린지 ${challenge.id} 알림 전송 실패:`, error);
      }
    }
  } catch (error) {
    console.error("챌린지 목록 조회 실패:", error);
  } finally {
    isChecking = false;
  }
}

// 서버 시작 시 스케줄러 등록
export function startDeadlineScheduler() {
  // 1시간마다 실행
  const interval = setInterval(checkAllChallengesDeadlines, 60 * 60 * 1000);

  // 서버 종료 시 인터벌 클린업
  const cleanup = () => {
    clearInterval(interval);
    console.log("데드라인 스케줄러 종료");
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  return interval;
}
