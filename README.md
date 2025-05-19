# 3팀 팀프로젝트 독스루 백엔드 레포지토리

## 서버 배포 주소 : https://six-docthru-3team-be.onrender.com

- API 명세서 노션 참고 : https://www.notion.so/API-1ec2facab63c81cd932ae4d734463ab5

- npm install dotenv : `process.env.STRING` 같은 표현을 사용가능하게 해주는 라이브러리.

- 포트 8080 이유: WAS의 경우 개발 및 테스트 환경의 표준, 충돌 가능성 감소, 많은 프레임워크의 기본 설정, 명시적인 포트 등의 이유로 사용했습니다.

- user.http | work.http | challenge.http : API 명세에 따라 메서드와 PATH 간략히 정리해두었습니다.

- Render 데이터베이스 프리즈마 연결해두었습니다. (.env)

- Render 배포 성공했습니다.

---

- 설치한 라이브러리 : express, cors, dotenv, cookie-parser, express-jwt, jsonwebtoken, prisma, bcrypt

- `npm i express cors dotenv cookie-parser express-jwt jsonwebtoken prisma bcrypt`

---

- 프리즈마 시딩(seeding)

- `npx prisma db seed`

- userMocks 데이터 시딩 작동되는 것 확인했습니다.

---
