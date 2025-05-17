import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";
import "dotenv/config";
import userRouter from "./routes/user.route.js";
import challengeRouter from "./routes/challenge.route.js";
import workRouter from "./routes/work.route.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/users", userRouter);
app.use("/challenge", challengeRouter);
app.use("/work", workRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`${PORT} Server Started!`);
});
