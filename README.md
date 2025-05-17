# Express + Prisma (sqlite) 스타터 템플릿.

- 반복적으로 사용하기에 만든 기본 틀.
- `2025-03-18` 기준 잘 작동함.

---

## 순서대로 실행하여 초기화하세요.

- `git clone https://github.com/rakaso598/prisma-express-starter.git`

- `cd prisma-express-starter/`

- `npm install`

- `echo 'DATABASE_URL="file:./dev.db"' > .env`

- `npm run dev`

- `curl http://localhost:5090/health-check`

![image](https://github.com/user-attachments/assets/73d75c11-4cd3-45e6-b625-78306e9f4d5e)

## 헬스체크 성공이 뜨면 초기화 완료.

---

### .env (git ignored 이므로 추가해줍니다.)

- `DATABASE_URL="file:./dev.db"`

---

### CLI : 명령어 설명입니다.

- `npm init` : node 프로젝트 초기화.
- `npm i express cors` : 웹 프레임워크, CORS 처리 미들웨어 설치.
- `npm i -D @types/express nodemon` : TypeScript 타입 정의 파일, 서버 자동 재시작 도구 설치.

---

### package.json : 필요 시 추가 및 교체하세요.

- `npm run dev로 nodemon 실행하도록 만듦` :

"scripts": {
"dev": "nodemon ./src/app.js"
}

- `프리즈마 경로를 바꿨을 시 추가` :

"prisma": {
"schema": "./src/db/prisma/schema.prisma"
}

---

### schema.prisma 자주쓰는 명령어

- `npm install typescript tsx @types/node --save-dev`

- `npm install prisma --save-dev`

- `npx prisma migrate dev`

- `npx prisma studio`

- `npx prisma migrate reset` : 데이터베이스 리셋 명령어.

- 다음은 스키마 테스트를 위한 예시 모델입니다.

model User {
id Int @id @default(autoincrement())
email String @unique
name String?
}

---
