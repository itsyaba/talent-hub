import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job ID is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "interviewed", "rejected", "hired"],
      default: "applied",
    },
    coverLetter: {
      type: String,
      required: false,
      trim: true,
    },
    resume: {
      type: String,
      required: false,
      trim: true,
    },
    experience: {
      type: String,
      required: false,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    expectedSalary: {
      type: Number,
      required: false,
    },
    availability: {
      type: String,
      enum: ["immediate", "2-weeks", "1-month", "3-months"],
      default: "immediate",
    },
    interviewNotes: {
      type: String,
      required: false,
      trim: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one application per user per job
applicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const Application =
  mongoose.models.Application || mongoose.model("Application", applicationSchema, "application");

export default Application;
