/* eslint-disable no-undef */
// @ts-nocheck
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import middleware from "./middleware.js";
import mongoose from "mongoose";
import "dotenv/config";
import logs from "./api/logs.js";

mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(morgan("common"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json()); //body parser

app.use("/api/logs", logs);

app.use(middleware.notfound);
app.use(middleware.errorHandler);

const port = process.env.PORTT || 1337;

app.get("/", (req, res) => {
  res.json({
    message: "hello world",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
