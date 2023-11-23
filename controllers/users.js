import mongoose from "mongoose";
import jwt from "jsonwebtoken";
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

      const token = jwt.sign(
        {
          email: req.user.email,
          id: req.user._id,
        },
        secret,
        { expiresIn: "1h" }
      );

      const result = {
        email: req.user.email,
        name: req.user.username,
        _id: req.user._id,
      };

      return res.status(200).json({ done: true, result, token });
    });
  } catch (e) {
    throw new AppError(e.message, 409);
  }
};

export const login = async (req, res) => {
  const token = jwt.sign(
    {
      email: req.user.email,
      id: req.user._id,
    },
    secret,
    { expiresIn: "1h" }
  );

  const result = {
    email: req.user.email,
    name: req.user.username,
    _id: req.user._id,
  };

  res.status(200).json({ done: true, result, token });
};

export const logout = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    res.status(200).json({ done: true });
  });
};
