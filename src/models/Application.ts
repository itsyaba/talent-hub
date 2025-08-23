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
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    coverLetter: {
      type: String,
      required: [true, "Cover letter is required"],
      trim: true,
    },
    resume: {
      filename: {
        type: String,
        required: [true, "Resume filename is required"],
      },
      size: {
        type: Number,
        required: [true, "Resume file size is required"],
      },
      type: {
        type: String,
        required: [true, "Resume file type is required"],
      },
      // In production, you'd also store the file URL
      url: {
        type: String,
        required: false,
      },
    },
    experience: {
      type: String,
      required: [true, "Experience is required"],
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
