import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema({
  degreeCode: {
    type: [String],
    required: [true, "At least one degree code is required"],
    lowercase: true,
    trim: true,
    default: []
  },
  degreeName: {
    type: [String],
    required: [true, "At least one Degree name is required"],
    trim: true,
    default: []
  },
  degreeType: {
    type: [String],
    required: [true, "At least one Degree type is required"],
    lowercase: true,
    trim: true,
    default: []
  },
  faculty: {
    type: String,
    required: [true, "Faculty is required"],
    trim: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
},
{
  timeseries: true
});

const Degree = mongoose.model("Degree", degreeSchema);

export default Degree;