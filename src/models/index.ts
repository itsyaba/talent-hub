// This file ensures all models are properly registered
import User from "./User";
import Job from "./Job";
import Application from "./Application";
import Notification from "./Notification";

// Export all models
export { User, Job, Application, Notification };

// Ensure models are registered by importing them
export default {
  User,
  Job,
  Application,
  Notification,
};
