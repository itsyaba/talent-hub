import dbConnect from "./db";
import { Job, Application, User } from "@/models";

// Sample data for testing
const sampleJobs = [
  {
    title: "Senior Frontend Developer",
    description:
      "We are looking for an experienced Frontend Developer to join our team and help build amazing user experiences.",
    requirements: ["React", "TypeScript", "Next.js", "Tailwind CSS", "5+ years experience"],
    location: "San Francisco, CA",
    type: "full-time",
    salary: {
      min: 120000,
      max: 180000,
      currency: "USD",
    },
    company: {
      name: "TechCorp Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
    },
    tags: ["frontend", "react", "typescript", "senior"],
    experienceLevel: "senior",
    status: "active",
  },
  {
    title: "React Native Developer",
    description:
      "Join our mobile team to build cross-platform mobile applications using React Native.",
    requirements: ["React Native", "JavaScript", "Mobile development", "3+ years experience"],
    location: "Remote",
    type: "full-time",
    salary: {
      min: 90000,
      max: 140000,
      currency: "USD",
    },
    company: {
      name: "TechCorp Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
    },
    tags: ["mobile", "react-native", "javascript", "remote"],
    experienceLevel: "mid",
    status: "active",
  },
  {
    title: "UI/UX Designer",
    description:
      "Create beautiful and intuitive user interfaces for our web and mobile applications.",
    requirements: ["Figma", "Adobe Creative Suite", "User research", "4+ years experience"],
    location: "New York, NY",
    type: "full-time",
    salary: {
      min: 80000,
      max: 130000,
      currency: "USD",
    },
    company: {
      name: "TechCorp Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
    },
    tags: ["design", "ui-ux", "figma", "creative"],
    experienceLevel: "mid",
    status: "active",
  },
  {
    title: "Backend Developer",
    description: "Build scalable backend services and APIs using Node.js and MongoDB.",
    requirements: ["Node.js", "MongoDB", "Express", "REST APIs", "3+ years experience"],
    location: "Austin, TX",
    type: "full-time",
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
    },
    company: {
      name: "TechCorp Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
    },
    tags: ["backend", "nodejs", "mongodb", "api"],
    experienceLevel: "mid",
    status: "active",
  },
  {
    title: "DevOps Engineer",
    description: "Manage our cloud infrastructure and deployment pipelines.",
    requirements: ["AWS", "Docker", "Kubernetes", "CI/CD", "4+ years experience"],
    location: "Seattle, WA",
    type: "full-time",
    salary: {
      min: 110000,
      max: 170000,
      currency: "USD",
    },
    company: {
      name: "TechCorp Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.techcorp.com",
      location: "San Francisco, CA",
    },
    tags: ["devops", "aws", "docker", "kubernetes"],
    experienceLevel: "senior",
    status: "active",
  },
  {
    title: "Financial Analyst",
    description: "Analyze financial data and provide insights to support business decisions.",
    requirements: ["Excel", "Financial modeling", "Data analysis", "2+ years experience"],
    location: "Chicago, IL",
    type: "full-time",
    salary: {
      min: 70000,
      max: 100000,
      currency: "USD",
    },
    company: {
      name: "FinanceHub Ltd.",
      industry: "Finance",
      size: "50-200 employees",
      website: "www.financehub.com",
      location: "Chicago, IL",
    },
    tags: ["finance", "analysis", "excel", "modeling"],
    experienceLevel: "mid",
    status: "active",
  },
  {
    title: "Marketing Manager",
    description: "Lead marketing campaigns and strategies to drive business growth.",
    requirements: ["Digital marketing", "Campaign management", "Analytics", "5+ years experience"],
    location: "Los Angeles, CA",
    type: "full-time",
    salary: {
      min: 80000,
      max: 120000,
      currency: "USD",
    },
    company: {
      name: "Growth Marketing Co.",
      industry: "Marketing",
      size: "25-100 employees",
      website: "www.growthmarketing.com",
      location: "Los Angeles, CA",
    },
    tags: ["marketing", "digital", "campaigns", "analytics"],
    experienceLevel: "senior",
    status: "active",
  },
  {
    title: "Data Scientist",
    description: "Extract insights from complex data sets to drive business decisions.",
    requirements: ["Python", "Machine Learning", "Statistics", "3+ years experience"],
    location: "Boston, MA",
    type: "full-time",
    salary: {
      min: 100000,
      max: 150000,
      currency: "USD",
    },
    company: {
      name: "DataInsights Inc.",
      industry: "Technology",
      size: "100-500 employees",
      website: "www.datainsights.com",
      location: "Boston, MA",
    },
    tags: ["data-science", "python", "machine-learning", "statistics"],
    experienceLevel: "mid",
    status: "active",
  },
];

const sampleApplications = [
  {
    status: "shortlisted",
    coverLetter:
      "I'm excited about this opportunity and believe my experience aligns perfectly with your requirements.",
    experience: "5 years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    expectedSalary: 150000,
    availability: "immediate",
  },
  {
    status: "applied",
    coverLetter:
      "I have a strong passion for mobile development and would love to contribute to your team.",
    experience: "3 years",
    skills: ["React Native", "JavaScript", "Mobile development"],
    expectedSalary: 120000,
    availability: "2-weeks",
  },
  {
    status: "interviewed",
    coverLetter:
      "I'm a creative designer with experience in user research and creating intuitive interfaces.",
    experience: "4 years",
    skills: ["Figma", "Adobe Creative Suite", "User research"],
    expectedSalary: 110000,
    availability: "immediate",
  },
  {
    status: "rejected",
    coverLetter:
      "I'm interested in backend development and have experience building scalable services.",
    experience: "2 years",
    skills: ["Node.js", "MongoDB", "Express"],
    expectedSalary: 100000,
    availability: "1-month",
  },
  {
    status: "hired",
    coverLetter: "I have extensive experience in cloud infrastructure and automation.",
    experience: "6 years",
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
    expectedSalary: 160000,
    availability: "immediate",
  },
];

export async function seedData(employerId: string) {
  try {
    await dbConnect();

    console.log("🌱 Starting data seeding...");

    // Check if jobs already exist
    const existingJobs = await Job.countDocuments();
    if (existingJobs > 0) {
      console.log(`📊 Found ${existingJobs} existing jobs, skipping creation`);
      const jobs = await Job.find({ status: "active" }).sort({ createdAt: -1 });
      return {
        jobs,
        message: "Jobs already exist in database",
      };
    }

    // Create sample jobs
    const createdJobs = [];
    for (const jobData of sampleJobs) {
      const job = new Job({
        ...jobData,
        createdBy: employerId,
      });
      const savedJob = await job.save();
      createdJobs.push(savedJob);
      console.log(`✅ Created job: ${savedJob.title}`);
    }

    // Create sample applications (assuming we have some user IDs)
    // In a real scenario, you'd need actual user IDs
    // For now, we'll create applications with the jobs we just created
    console.log("📝 Sample applications would be created here with real user IDs");

    console.log("🎉 Data seeding completed successfully!");
    console.log(`📊 Created ${createdJobs.length} jobs`);

    return {
      jobs: createdJobs,
      message: "Data seeded successfully",
    };
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  }
}

// Function to clear all seeded data
export async function clearSeededData() {
  try {
    await dbConnect();

    console.log("🧹 Clearing seeded data...");

    // Clear all jobs and applications
    await Job.deleteMany({});
    await Application.deleteMany({});

    console.log("✅ Seeded data cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing seeded data:", error);
    throw error;
  }
}
