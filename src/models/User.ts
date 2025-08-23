import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    image: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "employer"],
      default: "user",
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    companyProfile: {
      industry: {
        type: String,
        trim: true,
      },
      size: {
        type: String,
        trim: true,
      },
      website: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema, "user");

export default User;
