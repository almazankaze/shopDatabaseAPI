import AppError from "../utils/AppError.js";

export const isLoggedIn = (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      throw new AppError("must be logged in", 401);
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
