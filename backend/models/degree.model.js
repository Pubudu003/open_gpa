import mongoose from "mongoose";

const degreeSchema = new mongoose.Schema({
  degreeCode: {
    type: String,
    required: [true, "Degree code is required"],
    unique: true,
    lowercase: true,
    trim: true
  },
  degreeName: {
    type: String,
    required: [true, "Degree name is required"],
    trim: true,
  },
  degreeType: {
    type: String,
    required: [true, "Degree type is required"],
    lowercase: true,
    trim: true
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
  timestamps: true
});

const Degree = mongoose.model("Degree", degreeSchema);

export default Degree;