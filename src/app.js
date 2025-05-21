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

const app = express();
const PORT = process.env.PORT;

app.set("trust proxy", 1);
app.use(passport.initialize());

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/challenges", challengeRouter);
app.use("/works", workRouter);
app.use("/notifications", notificationRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} Server Started!`);
});
