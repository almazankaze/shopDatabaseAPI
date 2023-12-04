import express from "express";
import passport from "passport";

import {
  register,
  login,
  googleLogin,
  getUser,
  logout,
} from "../controllers/users.js";

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

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureMessage: true,
  })
);

userRouter.get(
  "/oauth2/redirect/google",
  passport.authenticate("google"),
  googleLogin
);

userRouter.get("/getUser", catchAsync(getUser));

userRouter.get("/logout", catchAsync(logout));

export default userRouter;
