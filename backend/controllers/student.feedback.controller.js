import Feedback from "../models/feedback.model.js";

const generateFeedbackNo = (feedbacks) => {
  const feedbackCount = feedbacks.length;
  const feedbackNo = feedbackCount + 1;
  return feedbackNo;
};

export const sendFeedback = async (req, res) => {
  try {
    //const email = req.user?.email;
    const email = "test@gmail.com";
    const { studentName, feedbackText } = req.body;

    if (!studentName || !feedbackText) {
      return res.status(400).json({
        success: false,
        errorCode: "MISSING_SOME_FIELDS",
        message: "Some required fields are missing!",
      });
    }

    const feedbackUserExists = await Feedback.findOne({ email });

    if (feedbackUserExists) {
      const updatedFeedbackUser = await Feedback.findOneAndUpdate(
        { email },
        {
          $set: { studentName },
          $push: {
            feedbacks: {
              feedbackNo: generateFeedbackNo(feedbackUserExists.feedbacks),
              feedbackText,
            },
          },
        },
        { new: true, runValidators: true },
      );

      if (!updatedFeedbackUser) {
        return res.status(404).json({
          success: false,
          errorCode: "USER_NOT_FOUND",
          message: "User not found",
        });
      }

      return res.status(201).json({
        success: true,
        feedbackUser: updatedFeedbackUser,
        message: "Feedback sent successfully",
      });
    }

    const newFeedbackUser = await Feedback.create({
      studentName,
      email,
      feedbacks: [
        {
          feedbackNo: 1, // assign first feedback no as 1
          feedbackText,
        },
      ],
    });

    if (!newFeedbackUser) {
      return res.status(500).json({
        success: false,
        errorCode: "FEEDBACK_USER_NOT_CREATED",
        message: "Feedback sent failed",
      });
    }

    return res.status(201).json({
      success: true,
      feedbackUser: newFeedbackUser,
      message: "Feedback sent successfully",
    });
  } catch (error) {
    console.error("Error in sendFeedback controller", error);
    res.status(500).json({
      success: false,
      errorCode: "CONTROLLER_ERROR",
      message: "Internal server error",
    });
  }
};
