import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import AppError from "../utils/AppError.js";

dotenv.config();
const secret = process.env.SECRET;

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new AppError("must be logged in", 401);
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError("Do not have access", 401);
    }

    const isCustomAuth = token.length < 500;

    let decodedData;

    // if token is local
    if (token && isCustomAuth) {
      decodedData = jwt.verify(token, secret);

      req.userId = decodedData?.id;
    }

    // google
    else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }

    next();
  } catch (e) {
    throw new AppError("unauthorized", 401);
  }
};

export const validateUserInfo = (req, res, next) => {
  const { password } = req.body;
  if (password.length < 8) {
    const msg = "password should be at least 8 characters";
    throw new AppError(msg, 400);
  } else {
    next();
  }
};
