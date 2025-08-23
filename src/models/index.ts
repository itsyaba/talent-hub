// This file ensures all models are properly registered
import User from "./User";
import Job from "./Job";
import Application from "./Application";

// Export all models
export { User, Job, Application };

// Ensure models are registered by importing them
export default {
  User,
  Job,
  Application,
};
