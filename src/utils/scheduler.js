import challengeRepository from "../repositories/challenge.repository.js";
import notificationService from "../services/notification.service.js";

let isChecking = false;
let schedulerTimer = null; // setTimeout, setInterval 모두 저장 가능

// 한국 시간 기준으로 다음 자정까지 남은 시간 계산
function getTimeUntilNextKSTMidnight() {
  const now = new Date();

  // 한국 시간(UTC+9)으로 변환
  const kstOffset = 9 * 60 * 60 * 1000; // 9시간
  const kstNow = new Date(now.getTime() + kstOffset);

  // 다음 날 자정(KST 00:00) 생성
  const nextMidnight = new Date(kstNow);
  nextMidnight.setUTCHours(0, 0, 0, 0); // KST 00:00 = UTC 15:00(전날)
  nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1); // 다음날로 이동

  // 남은 시간 반환
  return nextMidnight.getTime() - (now.getTime() + kstOffset);
}

// 챌린지 마감 체크 및 알림 전송
async function checkChallengeDeadlines() {
  if (isChecking) return;
  isChecking = true;

  try {
    const currentTime = new Date();
    // isClosed: false이고 마감시간이 지난 챌린지 조회
    const challenges = await challengeRepository.findExpiredChallenges(
      currentTime
    );

    for (const challenge of challenges) {
      try {
        // 챌린지 작성자 알림
        const message = notificationService.notificationMessages.challengeEnd(
          challenge.title
        );
        await notificationService.createNotification(
          challenge.authorId,
          message
        );

        // 참여자 알림
        if (challenge.participants?.length > 0) {
          for (const participant of challenge.participants) {
            await notificationService.createNotification(
              participant.userId,
              message
            );
          }
        }

        // 챌린지 닫기 상태로 업데이트
        await challengeRepository.closeChallenge(challenge.id);
      } catch (error) {
        console.error(`챌린지 ${challenge.id} 처리 실패:`, error);
      }
    }
  } catch (error) {
    console.error("스케줄러 실행 중 오류:", error);
  } finally {
    isChecking = false;
  }
}

// 다음 실행을 스케줄링
function scheduleNextRun() {
  const timeUntilNextRun = getTimeUntilNextKSTMidnight();

  schedulerTimer = setTimeout(async () => {
    await checkChallengeDeadlines();
    // 이후 매일 24시간마다 실행
    schedulerTimer = setInterval(checkChallengeDeadlines, 24 * 60 * 60 * 1000);
  }, timeUntilNextRun);
}

// 서버 시작 시 스케줄러 등록
export function startDeadlineScheduler() {
  // 최초 실행 스케줄링
  scheduleNextRun();

  // 서버 종료 시 클린업
  const cleanup = () => {
    if (schedulerTimer) {
      clearTimeout(schedulerTimer);
      clearInterval(schedulerTimer);
      console.log("데드라인 스케줄러 종료");
    }
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  return schedulerTimer;
}
