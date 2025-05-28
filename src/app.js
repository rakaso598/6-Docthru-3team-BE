import express from "express";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import challengeRouter from "./routes/challenge.route.js";
import workRouter from "./routes/work.route.js";
import authRouter from "./routes/auth.route.js";
import notificationRouter from "./routes/notification.route.js";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler.js";
import passport from "passport";
import "./middlewares/passport/passport.js";
import adminRouter from "./routes/admin.route.js";
import { startDeadlineScheduler } from "./utils/scheduler.js";

const app = express();
const PORT = process.env.PORT;

// TODO? cors origin설정에 배열을 직접 넣으면 매칭이 잘 안되는 경우가 있음 -> 동적으로 넣어서 문제 해결해보기 테스트
const allowedOrigins = [
  "http://localhost:3000",
  "https://6-docthru-3team-fe-dev.vercel.app",
  "https://6-docthru-3team-fe.vercel.app",
  // 필요 시 제거 가능 (프론트가 아님)
  // "https://six-docthru-3team-be-hdiq.onrender.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Postman, server-to-server 등 origin이 undefined인 경우 허용
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS 차단됨:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.set("trust proxy", 1);
app.use(passport.initialize());

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/challenges", challengeRouter);
app.use("/works", workRouter);
app.use("/notifications", notificationRouter);
app.use("/admin", adminRouter);
app.use(errorHandler);

startDeadlineScheduler();

app.listen(PORT, () => {
  console.log(`${PORT} Server Started!`);
});
