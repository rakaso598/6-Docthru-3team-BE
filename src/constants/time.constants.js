/**
 * 시간 단위를 초(seconds) 기준으로 정의한 상수
 */
export const TIME = {
  SECOND: 1,
  MINUTE: 60,
  HOUR: 60 * 60,
  DAY: 24 * 60 * 60,
  WEEK: 7 * 24 * 60 * 60,
};

export const TOKEN_EXPIRES = {
  ACCESS_TOKEN: "15m",
  REFRESH_TOKEN: "1w",
  ACCESS_TOKEN_COOKIE: 15 * TIME.MINUTE,
  REFRESH_TOKEN_COOKIE: 1 * TIME.WEEK, // 7일
};
