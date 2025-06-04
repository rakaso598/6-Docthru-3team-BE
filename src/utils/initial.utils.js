// 한글 초성 리스트
const initial = [
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
];

// 한글 문자열에서 초성만 추출
export function getInitial(str) {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      // 한글 유니코드 범위: 가 ~ 힣
      if (code >= 44032 && code <= 55203) {
        const initialIndex = Math.floor((code - 44032) / 588);
        return initial[initialIndex];
      }
      return char; // 한글 아닌 문자는 그대로
    })
    .join("");
}
