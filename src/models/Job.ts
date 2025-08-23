import mongoose, { Schema } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    salary: {
      min: {
        type: Number,
        required: false,
      },
      max: {
        type: Number,
        required: false,
      },
      currency: {
        type: String,
        default: "USD",
      },
    },
    company: {
      name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
      },
      industry: {
        type: String,
        required: false,
        trim: true,
      },
      size: {
        type: String,
        required: false,
        trim: true,
      },
      website: {
        type: String,
        required: false,
        trim: true,
      },
      location: {
        type: String,
        required: false,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job creator is required"],
    },
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    tags: {
      type: [String],
      default: [],
    },
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead"],
      default: "mid",
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
jobSchema.index({ title: "text", description: "text", requirements: "text", tags: "text" });

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema, "job");

export default Job;
