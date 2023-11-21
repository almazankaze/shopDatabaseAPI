import mongoose from "mongoose";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res) => {
  res.status(200).json({ done: true });
};

export const login = async (req, res) => {
  res.status(200).json({ done: true });
};

export const logout = async (req, res) => {};
