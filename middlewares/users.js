import AppError from "../utils/AppError.js";

export const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new AppError("must be logged in", 401);
  }
  next();
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
