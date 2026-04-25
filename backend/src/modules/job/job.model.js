import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    experienceLevel: {
      type: String,
      enum: ["ENTRY", "MID", "SENIOR"],
      required: true,
    },

    requiredSkills: {
      type: [String],
      default: [],
    },

    hiringModel: {
      type: String,
      enum: ["SELF_MANAGED", "ASSISTED"],
      required: true,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /*  NEW FIELD (LOGO FIX) */
    companyLogo: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
