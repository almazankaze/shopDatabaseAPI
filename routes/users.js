import express from "express";
import passport from "passport";
import dotenv from "dotenv";

import {
  register,
  login,
  googleLogin,
  getUser,
  logout,
} from "../controllers/users.js";

import catchAsync from "../utils/catchAsync.js";
import { validateUserInfo } from "../middlewares/users.js";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

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
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: process.env.WHITELISTED_DOMAINS,
    failureRedirect: "/google/failed",
    failureMessage: true,
  }),
  googleLogin
);

userRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    failureMessage: true,
  })
);

userRouter.get("/google/failed", (req, res) => {
  res.status(401).json({ error: true });
});

userRouter.get("/getUser", catchAsync(getUser));

userRouter.get("/logout", catchAsync(logout));

export default userRouter;
