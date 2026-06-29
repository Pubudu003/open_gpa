import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    feedbacks: [
      {
        feedbackNo: {
          type: Number,
          required: [true, "Feedback Number is required"],
          unique: true,
        },
        feedbackText: {
          type: String,
          required: [true, "Feedback text is required"],
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
