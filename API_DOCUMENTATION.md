# TalentHub API Documentation

## Overview

TalentHub provides a comprehensive REST API for managing job postings, applications, user profiles, and platform administration. The API is built with Next.js API routes and uses session-based authentication for security.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints require authentication using session-based auth. Include the session cookie in your requests. The API uses Better Auth for secure session management.

## Response Format

All API responses follow a consistent format:

**Success Response:**

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**

```json
{
  "success": false,
  "error": "Error message description"
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## 🔐 Authentication Endpoints

### POST /api/auth/signin

Authenticate a user and create a session.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "onboardingCompleted": true
    },
    "session": {
      "id": "session_id_456",
      "expiresAt": "2024-12-31T23:59:59Z"
    }
  }
}
```

### POST /api/auth/signup

Register a new user account.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "name": "Jane Smith"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id_789",
      "email": "newuser@example.com",
      "name": "Jane Smith",
      "role": "user",
      "onboardingCompleted": false
    }
  },
  "message": "Account created successfully"
}
```

### POST /api/auth/signout

Sign out the current user and destroy the session.

**Response:**

```json
{
  "success": true,
  "message": "Signed out successfully"
}
```

---

## 💼 Job Management Endpoints

### GET /api/jobs

Get all jobs with optional filtering and pagination.

**Query Parameters:**

- `status` (optional): Filter by job status (`active`, `paused`, `closed`)
- `type` (optional): Filter by job type (`full-time`, `part-time`, `contract`, `internship`)
- `location` (optional): Filter by location (case-insensitive search)
- `search` (optional): Text search across title, description, requirements, and tags
- `experienceLevel` (optional): Filter by experience level (`entry`, `junior`, `mid`, `senior`, `lead`)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id_123",
      "title": "Senior Frontend Developer",
      "description": "We are looking for an experienced frontend developer...",
      "requirements": ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      "location": "San Francisco, CA",
      "type": "full-time",
      "salary": {
        "min": 120000,
        "max": 180000,
        "currency": "USD"
      },
      "company": {
        "name": "TechCorp Inc.",
        "industry": "Technology",
        "size": "100-500 employees",
        "website": "www.techcorp.com",
        "location": "San Francisco, CA"
      },
      "status": "active",
      "createdBy": "employer_id_456",
      "tags": ["frontend", "react", "typescript"],
      "experienceLevel": "senior",
      "applications": ["app_id_1", "app_id_2"],
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### POST /api/jobs

Create a new job posting (employer only).

**Request Body:**

```json
{
  "title": "Full Stack Developer",
  "description": "We need a talented full stack developer...",
  "requirements": ["JavaScript", "React", "Node.js", "MongoDB"],
  "location": "Remote",
  "type": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "company": {
    "name": "StartupXYZ",
    "industry": "SaaS",
    "size": "10-50 employees",
    "website": "www.startupxyz.com",
    "location": "New York, NY"
  },
  "tags": ["fullstack", "javascript", "react"],
  "experienceLevel": "mid"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "job_id_789",
    "title": "Full Stack Developer",
    "createdBy": "employer_id_456",
    "status": "active",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "message": "Job created successfully"
}
```

### GET /api/jobs/[id]

Get detailed information about a specific job.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "job_id_123",
    "title": "Senior Frontend Developer",
    "description": "Detailed job description...",
    "requirements": ["React", "TypeScript", "Next.js"],
    "location": "San Francisco, CA",
    "type": "full-time",
    "salary": {
      "min": 120000,
      "max": 180000,
      "currency": "USD"
    },
    "company": {
      "name": "TechCorp Inc.",
      "industry": "Technology",
      "size": "100-500 employees",
      "website": "www.techcorp.com",
      "location": "San Francisco, CA"
    },
    "status": "active",
    "createdBy": {
      "_id": "employer_id_456",
      "name": "John Employer",
      "email": "john@techcorp.com"
    },
    "tags": ["frontend", "react", "typescript"],
    "experienceLevel": "senior",
    "applications": ["app_id_1", "app_id_2"],
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## 📝 Application Management Endpoints

### GET /api/applications

Get applications with optional filtering and pagination.

**Query Parameters:**

- `userId` (optional): Filter by user ID
- `jobId` (optional): Filter by job ID
- `status` (optional): Filter by application status
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "application_id_123",
      "jobId": {
        "_id": "job_id_456",
        "title": "Senior Frontend Developer",
        "company": {
          "name": "TechCorp Inc.",
          "location": "San Francisco, CA"
        },
        "type": "full-time"
      },
      "userId": {
        "_id": "user_id_789",
        "name": "John Doe",
        "email": "john@example.com",
        "image": "https://example.com/profile.jpg"
      },
      "status": "shortlisted",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "+1-555-0123",
      "location": "San Francisco, CA",
      "experience": "5 years",
      "skills": ["React", "TypeScript", "Next.js"],
      "expectedSalary": 150000,
      "availability": "immediate",
      "coverLetter": "I am excited to apply for this position...",
      "resume": {
        "url": "https://uploadthing.com/resume.pdf",
        "name": "John_Doe_Resume.pdf",
        "size": 1024000
      },
      "appliedAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  }
}
```

### POST /api/applications

Apply for a job (talent only).

**Request Body (FormData):**

```
jobId: "job_id_123"
fullName: "John Doe"
email: "john@example.com"
phone: "+1-555-0123"
location: "San Francisco, CA"
experience: "5 years"
skills: ["React", "TypeScript", "Next.js"]
expectedSalary: "150000"
availability: "immediate"
coverLetter: "I am excited to apply for this position..."
resume: [File object]
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id_789",
    "jobId": "job_id_123",
    "userId": "user_id_456",
    "status": "applied",
    "appliedAt": "2024-01-15T10:00:00Z"
  },
  "message": "Application submitted successfully"
}
```

### GET /api/applications/[id]

Get detailed information about a specific application.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id_123",
    "jobId": {
      "_id": "job_id_456",
      "title": "Senior Frontend Developer",
      "company": {
        "name": "TechCorp Inc.",
        "location": "San Francisco, CA"
      },
      "type": "full-time",
      "requirements": ["React", "TypeScript", "Next.js"]
    },
    "userId": {
      "_id": "user_id_789",
      "name": "John Doe",
      "email": "john@example.com",
      "image": "https://example.com/profile.jpg"
    },
    "status": "shortlisted",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-0123",
    "location": "San Francisco, CA",
    "experience": "5 years",
    "skills": ["React", "TypeScript", "Next.js"],
    "expectedSalary": 150000,
    "availability": "immediate",
    "coverLetter": "I am excited to apply for this position...",
    "resume": {
      "url": "https://uploadthing.com/resume.pdf",
      "name": "John_Doe_Resume.pdf",
      "size": 1024000
    },
    "interviewNotes": "Strong technical background, good communication skills",
    "appliedAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### PATCH /api/applications/[id]

Update application status (employer only).

**Request Body:**

```json
{
  "status": "shortlisted",
  "interviewNotes": "Candidate shows strong potential, schedule interview"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id_123",
    "status": "shortlisted",
    "interviewNotes": "Candidate shows strong potential, schedule interview",
    "updatedAt": "2024-01-15T10:00:00Z"
  },
  "message": "Application status updated successfully"
}
```

---

## 🏢 Employer Endpoints

### GET /api/employer/dashboard

Get comprehensive employer dashboard data.

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "activeJobs": 5,
      "totalApplications": 25,
      "interviews": 8,
      "hired": 3,
      "shortlisted": 12,
      "rejected": 2
    },
    "trends": {
      "applicationsThisMonth": 15,
      "applicationsLastMonth": 10,
      "applicationTrend": 50.0
    },
    "jobs": {
      "total": 8,
      "byStatus": {
        "active": 5,
        "paused": 2,
        "closed": 1
      },
      "recent": [
        {
          "_id": "job_id_123",
          "title": "Senior Frontend Developer",
          "status": "active",
          "createdAt": "2024-01-15T10:00:00Z",
          "applications": ["app_id_1", "app_id_2"]
        }
      ]
    },
    "applications": {
      "total": 25,
      "byStatus": {
        "applied": 10,
        "shortlisted": 12,
        "interviewed": 8,
        "rejected": 2,
        "hired": 3
      },
      "recent": [
        {
          "_id": "application_id_123",
          "status": "shortlisted",
          "appliedAt": "2024-01-15T10:00:00Z",
          "jobId": {
            "_id": "job_id_456",
            "title": "Senior Frontend Developer",
            "company": {
              "name": "TechCorp Inc.",
              "location": "San Francisco, CA"
            },
            "type": "full-time"
          },
          "userId": {
            "_id": "user_id_789",
            "name": "John Doe",
            "email": "john@example.com",
            "image": "https://example.com/profile.jpg"
          },
          "experience": "5 years",
          "skills": ["React", "TypeScript", "Next.js"]
        }
      ]
    }
  }
}
```

### GET /api/employer/company-profile

Get the employer's company profile information.

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "TechCorp Inc.",
    "companyProfile": {
      "industry": "Technology",
      "size": "100-500 employees",
      "website": "www.techcorp.com",
      "location": "San Francisco, CA"
    }
  }
}
```

### PATCH /api/employer/company-profile

Update the employer's company profile.

**Request Body:**

```json
{
  "name": "TechCorp Inc.",
  "industry": "Technology",
  "size": "100-500 employees",
  "website": "www.techcorp.com",
  "location": "San Francisco, CA"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "name": "TechCorp Inc.",
    "companyProfile": {
      "industry": "Technology",
      "size": "100-500 employees",
      "website": "www.techcorp.com",
      "location": "San Francisco, CA"
    }
  },
  "message": "Company profile updated successfully"
}
```

---

## 👨‍💻 Talent Endpoints

### GET /api/talent/dashboard

Get comprehensive talent dashboard data.

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalApplications": 15,
      "shortlisted": 8,
      "interviews": 3,
      "hired": 1,
      "rejected": 3
    },
    "applicationsByStatus": [
      { "_id": "applied", "count": 15 },
      { "_id": "shortlisted", "count": 8 },
      { "_id": "interviewed", "count": 3 },
      { "_id": "hired", "count": 1 },
      { "_id": "rejected", "count": 3 }
    ],
    "recentApplications": [
      {
        "_id": "application_id_123",
        "status": "shortlisted",
        "appliedAt": "2024-01-15T10:00:00Z",
        "jobId": {
          "_id": "job_id_456",
          "title": "Senior Frontend Developer",
          "company": {
            "name": "TechCorp Inc.",
            "location": "San Francisco, CA"
          },
          "type": "full-time",
          "salary": {
            "min": 120000,
            "max": 180000,
            "currency": "USD"
          },
          "status": "active"
        }
      }
    ],
    "recommendedJobs": [
      {
        "_id": "job_id_789",
        "title": "Full Stack Developer",
        "company": {
          "name": "StartupXYZ",
          "location": "Remote"
        },
        "type": "full-time",
        "salary": {
          "min": 80000,
          "max": 120000,
          "currency": "USD"
        },
        "createdBy": {
          "_id": "employer_id_456",
          "name": "Jane Employer"
        }
      }
    ],
    "profileViews": 25,
    "rating": 4.5,
    "monthlyApplications": [
      { "month": "Jan", "count": 5 },
      { "month": "Feb", "count": 3 },
      { "month": "Mar", "count": 7 }
    ]
  }
}
```

---

## 👨‍💼 Admin Endpoints

### GET /api/admin/dashboard

Get comprehensive admin dashboard data (admin only).

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 150,
      "activeJobs": 120,
      "totalApplications": 1250,
      "totalUsers": 500,
      "totalEmployers": 50,
      "totalTalents": 450
    },
    "trends": {
      "jobsThisMonth": 25,
      "jobsLastMonth": 20,
      "applicationsThisMonth": 150,
      "applicationsLastMonth": 120,
      "newUsersThisMonth": 45,
      "newUsersLastMonth": 35
    },
    "jobTrends": [
      {
        "month": "Jan",
        "jobs": 25,
        "applications": 150
      },
      {
        "month": "Feb",
        "jobs": 30,
        "applications": 180
      }
    ],
    "topEmployers": [
      {
        "_id": "employer_id_123",
        "name": "TechCorp Inc.",
        "jobsPosted": 15,
        "totalApplications": 120
      }
    ],
    "recentActivity": [
      {
        "type": "job_created",
        "description": "New job posted: Senior Developer",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

---

## 🔔 Notification Endpoints

### GET /api/notifications

Get user notifications with optional filtering.

**Query Parameters:**

- `limit` (optional): Number of notifications to return (default: 20)
- `skip` (optional): Number of notifications to skip (default: 0)
- `unreadOnly` (optional): Return only unread notifications (default: false)
- `category` (optional): Filter by notification category

**Response:**

```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "notification_id_123",
        "userId": "user_id_456",
        "type": "application_status",
        "title": "Application Status Updated",
        "message": "Your application for Senior Developer has been shortlisted",
        "category": "applications",
        "read": false,
        "data": {
          "jobId": "job_id_789",
          "status": "shortlisted"
        },
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "unreadCount": 5,
    "pagination": {
      "limit": 20,
      "skip": 0,
      "total": 15
    }
  }
}
```

### PATCH /api/notifications

Mark notifications as read.

**Request Body:**

```json
{
  "notificationIds": ["notification_id_123", "notification_id_456"],
  "read": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notifications marked as read",
  "data": {
    "updatedCount": 2
  }
}
```

### DELETE /api/notifications

Delete notifications.

**Request Body:**

```json
{
  "notificationIds": ["notification_id_123", "notification_id_456"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notifications deleted successfully",
  "data": {
    "deletedCount": 2
  }
}
```

### POST /api/notifications/welcome

Send a welcome notification to the current user.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "notification_id_789",
    "type": "welcome",
    "title": "Welcome to TalentHub!",
    "message": "Welcome to TalentHub! We're excited to have you on board.",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

---

## 👤 User Management Endpoints

### POST /api/user/update-role

Update user role (user or employer).

**Request Body:**

```json
{
  "role": "employer"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Role updated successfully to employer",
  "user": {
    "id": "user_id_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "employer",
    "onboardingCompleted": true
  }
}
```

---

## 🌱 Data Management Endpoints

### GET /api/seed

Seed the database with sample data (development only).

**Response:**

```json
{
  "success": true,
  "message": "Data seeded successfully",
  "data": [
    {
      "_id": "job_id_123",
      "title": "Senior Frontend Developer",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### POST /api/seed

Seed or clear database data (authenticated employer only).

**Request Body:**

```json
{
  "action": "seed"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Data seeded successfully",
  "data": [
    {
      "_id": "job_id_123",
      "title": "Senior Frontend Developer",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

**Clear Data:**

```json
{
  "action": "clear"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Seeded data cleared successfully"
}
```

---

## 📁 File Upload Endpoints

### POST /api/uploadthing

Upload files (resumes, documents, etc.).

**Request Body (FormData):**

```
file: [File object]
```

**Response:**

```json
{
  "success": true,
  "data": {
    "url": "https://uploadthing.com/filename.pdf",
    "name": "filename.pdf",
    "size": 1024000
  }
}
```

---

## 📊 Data Models

### User Model

```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  password: string,
  role: "user" | "employer" | "admin",
  image?: string,
  companyProfile?: {
    industry: string,
    size: string,
    website: string,
    location: string
  },
  onboardingCompleted: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Model

```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  requirements: string[],
  location: string,
  type: "full-time" | "part-time" | "contract" | "internship",
  salary: {
    min: number,
    max: number,
    currency: string
  },
  company: {
    name: string,
    industry: string,
    size: string,
    website: string,
    location: string
  },
  status: "active" | "paused" | "closed",
  createdBy: ObjectId,
  tags: string[],
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "lead",
  applications: ObjectId[],
  createdAt: Date,
  updatedAt: Date
}
```

### Application Model

```typescript
{
  _id: ObjectId,
  jobId: ObjectId,
  userId: ObjectId,
  status: "applied" | "shortlisted" | "interviewed" | "rejected" | "hired",
  fullName: string,
  email: string,
  phone: string,
  location: string,
  experience: string,
  skills: string[],
  expectedSalary: number,
  availability: "immediate" | "2-weeks" | "1-month" | "3-months",
  coverLetter: string,
  resume: {
    url: string,
    name: string,
    size: number
  },
  interviewNotes?: string,
  appliedAt: Date,
  updatedAt: Date
}
```

### Notification Model

```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  type: string,
  title: string,
  message: string,
  category?: string,
  read: boolean,
  data?: any,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security & Rate Limiting

### Authentication

- All endpoints require valid session authentication
- Sessions expire after 30 days of inactivity
- Secure HTTP-only cookies for session management

### Authorization

- Role-based access control (RBAC)
- Users can only access their own data
- Employers can only manage applications for their jobs
- Admin endpoints require admin role

### Input Validation

- All input is validated and sanitized
- File uploads are restricted by type and size
- SQL injection protection through Mongoose ODM

### Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

---

## 🧪 Testing & Development

### Testing Endpoints

1. **Seed Data**: Use `/api/seed` to populate the database with sample data
2. **Test Authentication**: Create accounts and test login/logout flows
3. **Test Job Management**: Create, update, and delete jobs as an employer
4. **Test Applications**: Submit applications as a talent user
5. **Test Notifications**: Verify notification system functionality

### Development Tools

- Use browser dev tools to inspect API responses
- Check server logs for detailed error information
- Test with different user roles and permissions
- Verify file upload functionality with various file types

---

## 📚 Additional Resources

- **Frontend Components**: See the `src/components/` directory for UI components
- **Database Schema**: Check `src/models/` for detailed model definitions
- **Authentication**: Review `src/lib/auth/` for auth implementation
- **File Upload**: See `src/utils/uploadthing.ts` for file handling

---

_For questions or support, please refer to the main README.md or open an issue on GitHub._
