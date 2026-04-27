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

    /* MISSING FIELDS - ADD FROM FRONTEND */
    companyName: {
      type: String,
      default: "",
    },

    employmentType: {
      type: String,
      default: "",
    },

    department: {
      type: String,
      default: "",
    },

    workMode: {
      type: String,
      default: "Onsite",
    },

    preferredSkills: {
      type: [String],
      default: [],
    },

    hiringPreferences: {
      type: String,
      default: "",
    },

    compensation: {
      min: { type: Number, default: null },
      max: { type: Number, default: null },
      currency: { type: String, default: "USD" },
      frequency: { type: String, default: "Yearly" },
      showPublicly: { type: Boolean, default: true },
      bonus: { type: String, default: "" },
      hasEquity: { type: Boolean, default: false },
      equityRange: { type: String, default: "" },
      vestingPeriod: { type: String, default: "" },
    },

    applicationLastDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
