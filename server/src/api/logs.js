// @ts-nocheck
import express from "express";
import LogEntry from "../models/LogEntry.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const entires = await LogEntry.find();
    res.json(entires);
  } catch (error) {
    next(error);
  }
});

router.get("/", (req, res) => {
  res.json({
    message: "Logs API",
  });
});

router.post("/", async (req, res, next) => {
  try {
    const logEntry = new LogEntry(req.body);
    const createdLogEntry = await logEntry.save();
    res.json(createdLogEntry);
  } catch (error) {
    if (error.name === "ValidationError") {
      res.status(422);
    }
    next(error);
  }
});

export default router;
