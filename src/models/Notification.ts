import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: [
        // Job-related notifications
        "job_posted",
        "job_application_received",
        "job_application_status_changed",
        "job_expired",
        "job_closed",

        // Application-related notifications
        "application_submitted",
        "application_shortlisted",
        "application_interviewed",
        "application_hired",
        "application_rejected",
        "application_reconsidered",

        // Profile-related notifications
        "profile_updated",
        "company_profile_updated",

        // System notifications
        "welcome",
        "account_verified",
        "password_reset",
        "new_message",
        "reminder_interview",
        "reminder_job_expiry",
      ],
      required: [true, "Notification type is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    data: {
      // Additional data for the notification
      jobId: {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
      applicationId: {
        type: Schema.Types.ObjectId,
        ref: "Application",
      },
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      companyId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      // For status changes
      oldStatus: String,
      newStatus: String,
      // For reminders
      scheduledDate: Date,
      // For messages
      messageId: String,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    category: {
      type: String,
      enum: ["job", "application", "profile", "system", "message"],
      required: [true, "Notification category is required"],
    },
    expiresAt: {
      type: Date,
      // Notifications expire after 90 days by default
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, category: 1 });
notificationSchema.index({ createdAt: 1 }); // For cleanup of expired notifications

// Auto-delete expired notifications (runs daily)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Ensure one notification per user per type per related entity (for certain types)
notificationSchema.index(
  { userId: 1, type: 1, "data.jobId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      type: { $in: ["job_posted", "job_expired", "job_closed"] },
      "data.jobId": { $exists: true },
    },
  }
);

// Force recompilation by deleting the old model if it exists
if (mongoose.models.Notification) {
  delete mongoose.models.Notification;
}

const Notification = mongoose.model("Notification", notificationSchema, "notification");

export default Notification;
