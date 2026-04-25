





import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
    },
    role: {
      type: String,
      enum: ["CANDIDATE", "RECRUITER"],
      required: true,
      uppercase: true,
      trim: true,
    },
    googleId: {
      type: String,
    },
    company: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);