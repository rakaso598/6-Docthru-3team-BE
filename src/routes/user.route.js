import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// 모든 유저 조회
userRouter.get("/", getAllUsers);

// 특정 유저 조회
userRouter.get("/:userId", getUserById);

// 유저 생성
userRouter.post("/", createUser);

// 유저 정보 수정
userRouter.put("/:userId", updateUser);

// 유저 삭제
userRouter.delete("/:userId", deleteUser);

export default userRouter;
