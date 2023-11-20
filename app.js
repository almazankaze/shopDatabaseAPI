import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";

import products from "./routes/products.js";
import reviews from "./routes/reviews.js";
import search from "./routes/search.js";
import AppError from "./utils/AppError.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const sessionConfig = {
  name: "session",
  //secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
//app.use(session(sessionConfig));

app.use("/products", products);
app.use("/products/:id/reviews", reviews);
app.use("/search", search);

app.get("/", (req, res) => {
  res.send("APP RUNNING!");
});

app.all("*", (req, res, next) => {
  next(new AppError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { status = 500 } = err;

  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(status).json({ status: status, message: err.message });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.CONNECTION)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((e) =>
    console.log("Something went wrong and could not start server.")
  );
