import mongoose from "mongoose";
const { Schema } = mongoose;

const requiredString = {
  type: String,
  required: true,
};
const requiredNum = {
  type: Number,
  required: true,
};

const logEntrySchema = new Schema(
  {
    title: requiredString,
    description: String,
    comments: String,
    image: String,
    rating: { type: Number, min: 0, max: 5, default: 0 },
    latitude: {
      ...requiredNum,
      min: -90,
      max: 90,
    },
    longitude: {
      ...requiredNum,
      min: -180,
      max: 180,
    },
    visitDate: {
      required: true,
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const LogEntry = mongoose.model("LogEntry", logEntrySchema);

export default LogEntry;
