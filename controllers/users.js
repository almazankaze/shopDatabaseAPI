import dotenv from "dotenv";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

dotenv.config();
const secret = process.env.SECRET;

export const register = async (req, res) => {
  const { email, username, password } = req.body;
  const user = new User({ email, username });

  try {
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      return res.status(200).json({ done: true });
    });
  } catch (e) {
    throw new AppError(e.message, 409);
  }
};

export const login = async (req, res) => {
  res.status(200).json({ done: true });
};

export const getUser = async (req, res, next) => {
  res.json(req.user);
};

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.status(200).json({ done: true });
  });
};
