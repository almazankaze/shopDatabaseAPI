import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import products from "./routes/products.js";

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/products", products);

app.get("/", (req, res) => {
  res.send("APP RUNNING");
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
