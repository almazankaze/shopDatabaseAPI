import express from "express";

import { register, login, logout } from "../controllers/users.js";

import catchAsync from "../utils/catchAsync.js";

const userRouter = express.Router();

userRouter.post("/register", catchAsync(register));
userRouter.post("/login", catchAsync(login));

export default userRouter;
