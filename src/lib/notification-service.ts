import dbConnect from "./db";
import { Notification, User, Job, Application } from "@/models";

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: {
    jobId?: string;
    applicationId?: string;
    userId?: string;
    companyId?: string;
    oldStatus?: string;
    newStatus?: string;
    scheduledDate?: Date;
    messageId?: string;
  };
  priority?: "low" | "medium" | "high" | "urgent";
  category: "job" | "application" | "profile" | "system" | "message";
}

export class NotificationService {
  /**
   * Create a new notification
   */
  static async createNotification(notificationData: CreateNotificationData) {
    try {
      await dbConnect();

      const notification = new Notification(notificationData);
      await notification.save();

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  /**
   * Create multiple notifications for multiple users
   */
  static async createBulkNotifications(notifications: CreateNotificationData[]) {
    try {
      await dbConnect();

      const notificationDocs = notifications.map((data) => new Notification(data));
      const savedNotifications = await Notification.insertMany(notificationDocs);

      return savedNotifications;
    } catch (error) {
      console.error("Error creating bulk notifications:", error);
      throw error;
    }
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(
    userId: string,
    options: {
      limit?: number;
      skip?: number;
      unreadOnly?: boolean;
      category?: string;
    } = {}
  ) {
    try {
      await dbConnect();

      const { limit = 20, skip = 0, unreadOnly = false, category } = options;

      const query: any = { userId };

      if (unreadOnly) {
        query.isRead = false;
      }

      if (category) {
        query.category = category;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      return notifications;
    } catch (error) {
      console.error("Error fetching user notifications:", error);
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      await dbConnect();

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: string, category?: string) {
    try {
      await dbConnect();

      const query: any = { userId, isRead: false };
      if (category) {
        query.category = category;
      }

      const result = await Notification.updateMany(query, { isRead: true });

      return result;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  }

  /**
   * Get unread count for a user
   */
  static async getUnreadCount(userId: string, category?: string) {
    try {
      await dbConnect();

      const query: any = { userId, isRead: false };
      if (category) {
        query.category = category;
      }

      const count = await Notification.countDocuments(query);

      return count;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async deleteNotification(notificationId: string, userId: string) {
    try {
      await dbConnect();

      const result = await Notification.deleteOne({ _id: notificationId, userId });

      return result;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  /**
   * Clean up expired notifications
   */
  static async cleanupExpiredNotifications() {
    try {
      await dbConnect();

      const result = await Notification.deleteMany({
        expiresAt: { $lt: new Date() },
      });

      return result;
    } catch (error) {
      console.error("Error cleaning up expired notifications:", error);
      throw error;
    }
  }

  // Specific notification creators for common events

  /**
   * Notify employer when a job is posted
   */
  static async notifyJobPosted(jobId: string, employerId: string, jobTitle: string) {
    return this.createNotification({
      userId: employerId,
      type: "job_posted",
      title: "Job Posted Successfully",
      message: `Your job posting "${jobTitle}" has been published and is now visible to candidates.`,
      data: { jobId },
      priority: "medium",
      category: "job",
    });
  }

  /**
   * Notify employer when they receive a job application
   */
  static async notifyJobApplicationReceived(
    jobId: string,
    employerId: string,
    applicationId: string,
    candidateName: string,
    jobTitle: string
  ) {
    return this.createNotification({
      userId: employerId,
      type: "job_application_received",
      title: "New Job Application",
      message: `${candidateName} has applied for your "${jobTitle}" position.`,
      data: { jobId, applicationId, userId: employerId },
      priority: "high",
      category: "application",
    });
  }

  /**
   * Notify candidate when their application status changes
   */
  static async notifyApplicationStatusChanged(
    applicationId: string,
    candidateId: string,
    jobTitle: string,
    oldStatus: string,
    newStatus: string,
    companyName: string
  ) {
    const statusMessages = {
      shortlisted: `Congratulations! You've been shortlisted for "${jobTitle}" at ${companyName}.`,
      interviewed: `Great news! You've been selected for an interview for "${jobTitle}" at ${companyName}.`,
      hired: `🎉 You've been hired for "${jobTitle}" at ${companyName}! Welcome to the team!`,
      rejected: `Thank you for your interest in "${jobTitle}" at ${companyName}. Unfortunately, we won't be moving forward with your application at this time.`,
      reconsidered: `Good news! Your application for "${jobTitle}" at ${companyName} is being reconsidered.`,
    };

    const message =
      statusMessages[newStatus as keyof typeof statusMessages] ||
      `Your application status for "${jobTitle}" at ${companyName} has changed from ${oldStatus} to ${newStatus}.`;

    return this.createNotification({
      userId: candidateId,
      type: `application_${newStatus}`,
      title: `Application ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      message,
      data: {
        applicationId,
        oldStatus,
        newStatus,
      },
      priority: newStatus === "hired" ? "urgent" : "high",
      category: "application",
    });
  }

  /**
   * Notify user when their profile is updated
   */
  static async notifyProfileUpdated(userId: string, profileType: "profile" | "company_profile") {
    const type = profileType === "company_profile" ? "company_profile_updated" : "profile_updated";
    const title = profileType === "company_profile" ? "Company Profile Updated" : "Profile Updated";
    const message =
      profileType === "company_profile"
        ? "Your company profile has been successfully updated."
        : "Your profile has been successfully updated.";

    return this.createNotification({
      userId,
      type,
      title,
      message,
      category: "profile",
      priority: "low",
    });
  }

  /**
   * Notify user when they first sign up
   */
  static async notifyWelcome(userId: string, userName: string) {
    return this.createNotification({
      userId,
      type: "welcome",
      title: "Welcome to Talent Hub! 🎉",
      message: `Hi ${userName}, welcome to Talent Hub! We're excited to have you on board. Start exploring jobs or posting positions to get started.`,
      category: "system",
      priority: "medium",
    });
  }

  /**
   * Notify employer when job is about to expire
   */
  static async notifyJobExpiryReminder(
    jobId: string,
    employerId: string,
    jobTitle: string,
    daysLeft: number
  ) {
    return this.createNotification({
      userId: employerId,
      type: "reminder_job_expiry",
      title: "Job Expiry Reminder",
      message: `Your job posting "${jobTitle}" will expire in ${daysLeft} day${
        daysLeft === 1 ? "" : "s"
      }. Consider extending it or closing it.`,
      data: { jobId },
      priority: "medium",
      category: "job",
    });
  }

  /**
   * Notify candidate about upcoming interview
   */
  static async notifyInterviewReminder(
    applicationId: string,
    candidateId: string,
    jobTitle: string,
    companyName: string,
    interviewDate: Date
  ) {
    const formattedDate = interviewDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return this.createNotification({
      userId: candidateId,
      type: "reminder_interview",
      title: "Interview Reminder",
      message: `Reminder: You have an interview for "${jobTitle}" at ${companyName} on ${formattedDate}. Good luck!`,
      data: {
        applicationId,
        scheduledDate: interviewDate,
      },
      priority: "high",
      category: "application",
    });
  }
}
