import express from "express";
import passport from "passport";

import { register, login, logout } from "../controllers/users.js";

import catchAsync from "../utils/catchAsync.js";
import { validateUserInfo } from "../middlewares/users.js";

const userRouter = express.Router();

userRouter.post("/register", validateUserInfo, catchAsync(register));

userRouter.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: true,
  }),
  catchAsync(login)
);

userRouter.get("/logout", catchAsync(logout));

export default userRouter;
