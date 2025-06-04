# 📚 Docthru (독스루) - 개발 문서 번역 챌린지 플랫폼

![image](https://github.com/user-attachments/assets/111a1379-7089-4d1d-9cf7-f02f8bb41d44)

## 🚀 프로젝트 소개

Docthru는 개발 관련 영어 문서를 함께 번역하는 챌린지 플랫폼입니다. 영어로 작성된 개발 문서를 한국어로 번역하고, 피드백을 주고받으며 함께 성장하는 공간을 제공합니다.

## 👥 팀 소개

| 이름   | 역할    | GitHub                                   | 개인 개발 보고서                                                 |
| ------ | ------- | ---------------------------------------- | ---------------------------------------------------------------- |
| 조성빈 | 🍉 팀장 | [github](https://github.com/JJOBO/)      | [보고서](https://www.notion.so/1ec2facab63c81eca07af4d8f2bd39c0) |
| 심유빈 | 🍒 팀원 | [github](https://github.com/shimyubin/)  | [보고서](https://www.notion.so/1f32facab63c8063af31e35ceaf5e7a8) |
| 오하영 | 🍑 팀원 | [github](https://github.com/fiivxyxxng/) | [보고서](https://www.notion.so/1f32facab63c8096b969da4f5399bd3a) |
| 김홍섭 | 🍇 팀원 | [github](https://github.com/rakaso598/)  | [보고서](https://www.notion.so/1f32facab63c80088ad2eba91feb3155) |
| 황수정 | 🍎 팀원 | [github](https://github.com/suejeong/)   | [보고서](https://www.notion.so/1f32facab63c80b08333f61e56fa361e) |
| 김수경 | 🍊 팀원 | [github](https://github.com/suKyoung25/) | [보고서](https://www.notion.so/1f32facab63c806bb835c90523b6869b) |
| 박민규 | 🍈 팀원 | [github](https://github.com/gksktl111/)  | [보고서](https://www.notion.so/1f32facab63c80b4b1c0f468d3656e78) |

## 팀 문서

📝 [팀 노션](https://www.notion.so/1ec2facab63c808d9b80ca0759018768?v=1ec2facab63c8156b3aa000c4b136520)

## 배포 주소

🚀 [DocThru](https://6-docthru-3team-fe-dev.vercel.app/)

## 🗺️ 시스템 아키텍처

프로젝트의 전체 시스템 아키텍처를 시각적으로 보여주거나, 주요 구성 요소 및 흐름을 설명해주세요. (예: 다이어그램, 텍스트 설명)

## ✨ 주요 기능

백엔드에서 제공하는 핵심 기능들을 간략하게 나열해주세요. (자세한 설명은 필요 없습니다.)

  * 기능 1: 간략한 설명
  * 기능 2: 간략한 설명
  * ...

## 📊 주요 ERD (개체-관계 다이어그램)

<details>
<summary>유저 모델</summary>

![image](https://github.com/user-attachments/assets/0d9ab8b4-b173-4d30-bae9-8c99ea2adf28)

</details>

<details>
<summary>챌린지 모델</summary>

![image](https://github.com/user-attachments/assets/78a6f046-f11b-435a-96b9-425b92dd65a5)

</details>

<details>
<summary>작업물 모델</summary>

![image](https://github.com/user-attachments/assets/753396ea-70eb-4889-ac33-1d17a9827507)

</details>

## 🎬 기능 구현 영상

[![프로젝트 소개 영상 썸네일](https://github.com/user-attachments/assets/0938a97a-4a0b-4206-a678-4fc871b9edbb)](https://youtu.be/EClrOPXoyFY)

## 🛠️ 기술 스택 (Backend)

<details>
<summary>✅ 핵심 기술</summary>

* **Node.js**: 백엔드 애플리케이션의 런타임 환경입니다.
* **Express.js**: Node.js 기반의 빠르고 간결한 웹 프레임워크입니다.
* **Prisma**: 차세대 ORM(객체-관계 매퍼)으로 데이터베이스 접근을 간소화합니다.
* **TypeScript**: JavaScript의 상위 집합으로 코드 품질을 향상시킵니다.
* **PostgreSQL**: 안정적이고 확장성이 뛰어난 오픈 소스 객체-관계형 데이터베이스입니다.

</details>

<details>
<summary>✅ 인증 및 보안</summary>

* **JWT (JSON Web Tokens)**: 안전한 토큰 기반 인증에 사용됩니다.
* **bcrypt**: 사용자 비밀번호를 안전하게 해싱합니다.
* **Passport.js**: Node.js를 위한 유연한 인증 미들웨어입니다.
* **cookie-parser**: 클라이언트 요청 쿠키를 파싱합니다.

</details>

<details>
<summary>✅ 유틸리티 및 개발 도구</summary>

* **dotenv**: 환경 변수를 관리합니다.
* **cors**: 교차 출처 리소스 공유(CORS)를 활성화합니다.
* **nodemon**: 개발 중 파일 변경 시 애플리케이션을 자동 재시작합니다.

</details>

## 🧩 프로젝트 구조

\<details\>
\<summary\>클릭하여 프로젝트 구조 보기\</summary\>

```
📦src
 ┣ 📂constants/             # 전역 상수 정의
 ┣ 📂controllers/           # API 요청 처리 및 응답 담당 (각 도메인별 분리)
 ┣ 📂exceptions/            # 커스텀 예외 및 에러 메시지 정의
 ┣ 📂middlewares/           # 요청 전처리/후처리, 인증, 유효성 검사 등 미들웨어
 ┃ ┗ 📂passport/          # Passport.js 인증 전략 (Google OAuth 포함)
 ┣ 📂prisma/                # Prisma ORM 관련 파일 (스키마, 마이그레이션, 시딩)
 ┃ ┣ 📂migrations/        # 데이터베이스 스키마 변경 이력
 ┃ ┣ 📂seed/              # 초기/테스트 데이터 시딩 로직
 ┃ ┃ ┗ 📂mocks/         # 시딩을 위한 목(Mock) 데이터
 ┣ 📂repositories/          # 데이터베이스 접근 및 쿼리 로직
 ┣ 📂routes/                # API 엔드포인트 및 라우팅 정의
 ┣ 📂services/              # 비즈니스 로직 및 데이터 처리
 ┣ 📂utils/                 # 재사용 가능한 유틸리티 함수 및 헬퍼
 ┗ 📜app.js                 # 애플리케이션의 메인 진입점
```

\</details\>

-----

## 🤯 트러블 슈팅

<details>
<summary>필터 검색 시, 카테고리 쿼리 전달</summary>

![image](https://github.com/user-attachments/assets/26854d51-c80d-4cff-8395-3bbbc978cd09)

![image](https://github.com/user-attachments/assets/6ca24c62-21d0-4821-9012-f7eab6c52077)

</details>

<details>
<summary>유저 정보 조회 에러</summary>

![image](https://github.com/user-attachments/assets/d0c5adf1-f20a-4b5d-9fdd-180a50d37302)

![image](https://github.com/user-attachments/assets/b27c38c1-6af7-4a33-a5e2-897fe8444d19)

</details>

