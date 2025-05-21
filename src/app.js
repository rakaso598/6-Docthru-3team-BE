import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import challengeRouter from "./routes/challenge.route.js";
import workRouter from "./routes/work.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import feedbackRouter from "./routes/feedback.route.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/challenges", challengeRouter);
app.use("/works", workRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} Server Started!`);
});
