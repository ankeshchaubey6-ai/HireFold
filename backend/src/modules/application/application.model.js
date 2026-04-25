import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    
    resumeId: {
      type: String, // matches your Resume.resumeId (UUID)
      required: false,
      index: true,
    },

    /*  ATS CACHE (FAST UI RENDER) */
    atsScore: {
      type: Number,
      default: null,
      index: true,
    },

    ats: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    /* AI SYSTEM FIELDS (ENTERPRISE) */
    aiRank: {
      type: Number,
      default: null,
      index: true,
    },

    aiShortlisted: {
      type: Boolean,
      default: false,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEW",
        "REJECTED",
        "HIRED",
      ],
      default: "APPLIED",
      index: true,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate applications */
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
