# TalentHub API Documentation

## Overview

TalentHub is a mini job portal platform where companies can post job listings, developers can apply for jobs, and employers can manage applications.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All API endpoints require authentication using session-based auth. Include the session cookie in your requests.

## Endpoints

### Jobs

#### GET /api/jobs

Get all jobs with optional filtering and pagination.

**Query Parameters:**

- `status` (optional): Filter by job status (`active`, `paused`, `closed`)
- `type` (optional): Filter by job type (`full-time`, `part-time`, `contract`, `internship`)
- `location` (optional): Filter by location (case-insensitive search)
- `search` (optional): Text search across title, description, requirements, and tags
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "title": "Senior Frontend Developer",
      "description": "Job description...",
      "requirements": ["React", "TypeScript"],
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
      "createdBy": "user_id",
      "tags": ["frontend", "react"],
      "experienceLevel": "senior",
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

#### POST /api/jobs

Create a new job posting (employer only).

**Request Body:**

```json
{
  "title": "Job Title",
  "description": "Job description",
  "requirements": ["Requirement 1", "Requirement 2"],
  "location": "Job location",
  "type": "full-time",
  "salary": {
    "min": 80000,
    "max": 120000,
    "currency": "USD"
  },
  "company": {
    "name": "Company Name",
    "industry": "Industry",
    "size": "Company size",
    "website": "Company website",
    "location": "Company location"
  },
  "tags": ["tag1", "tag2"],
  "experienceLevel": "mid"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "job_id",
    "title": "Job Title",
    "createdBy": "employer_id",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Applications

#### GET /api/applications

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
      "_id": "application_id",
      "jobId": {
        "_id": "job_id",
        "title": "Job Title",
        "company": {
          "name": "Company Name",
          "location": "Location"
        },
        "type": "full-time"
      },
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "image": "profile_image_url"
      },
      "status": "applied",
      "coverLetter": "Cover letter text",
      "experience": "5 years",
      "skills": ["Skill 1", "Skill 2"],
      "expectedSalary": 120000,
      "availability": "immediate",
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

#### POST /api/applications

Apply for a job (talent only).

**Request Body:**

```json
{
  "jobId": "job_id",
  "coverLetter": "Cover letter text",
  "resume": "resume_url",
  "experience": "5 years",
  "skills": ["Skill 1", "Skill 2"],
  "expectedSalary": 120000,
  "availability": "immediate"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id",
    "jobId": "job_id",
    "userId": "user_id",
    "status": "applied",
    "appliedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET /api/applications/[id]

Get application details by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id",
    "jobId": {
      "_id": "job_id",
      "title": "Job Title",
      "company": {
        "name": "Company Name",
        "location": "Location"
      },
      "type": "full-time",
      "requirements": ["Requirement 1", "Requirement 2"]
    },
    "userId": {
      "_id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "image": "profile_image_url"
    },
    "status": "applied",
    "coverLetter": "Cover letter text",
    "experience": "5 years",
    "skills": ["Skill 1", "Skill 2"],
    "expectedSalary": 120000,
    "availability": "immediate",
    "appliedAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

#### PATCH /api/applications/[id]

Update application status (employer only).

**Request Body:**

```json
{
  "status": "shortlisted",
  "interviewNotes": "Interview notes"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id",
    "status": "shortlisted",
    "interviewNotes": "Interview notes",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### Employer Dashboard

#### GET /api/employer/dashboard

Get employer dashboard data with statistics and recent activity.

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
          "_id": "job_id",
          "title": "Job Title",
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
          "_id": "application_id",
          "status": "shortlisted",
          "appliedAt": "2024-01-15T10:00:00Z",
          "jobId": {
            "_id": "job_id",
            "title": "Job Title",
            "company": {
              "name": "Company Name",
              "location": "Location"
            },
            "type": "full-time"
          },
          "userId": {
            "_id": "user_id",
            "name": "User Name",
            "email": "user@example.com",
            "image": "profile_image_url"
          },
          "experience": "5 years",
          "skills": ["Skill 1", "Skill 2"]
        }
      ]
    }
  }
}
```

### Data Seeding

#### POST /api/seed

Seed the database with sample data for testing (employer only).

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
      "_id": "job_id",
      "title": "Senior Frontend Developer",
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

## Data Models

### Job

- `title`: Job title (required)
- `description`: Job description (required)
- `requirements`: Array of job requirements
- `location`: Job location (required)
- `type`: Job type (full-time, part-time, contract, internship)
- `salary`: Salary range with min, max, and currency
- `company`: Company information (name, industry, size, website, location)
- `status`: Job status (active, paused, closed)
- `createdBy`: User ID of job creator (required)
- `tags`: Array of job tags
- `experienceLevel`: Required experience level (entry, junior, mid, senior, lead)
- `applications`: Array of application IDs
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Application

- `jobId`: Job ID (required)
- `userId`: User ID (required)
- `status`: Application status (applied, shortlisted, interviewed, rejected, hired)
- `coverLetter`: Cover letter text
- `resume`: Resume file URL
- `experience`: Years of experience
- `skills`: Array of skills
- `expectedSalary`: Expected salary
- `availability`: Availability timeline (immediate, 2-weeks, 1-month, 3-months)
- `interviewNotes`: Notes from interviews
- `appliedAt`: Application timestamp
- `updatedAt`: Last update timestamp

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for production use.

## Security Notes

- All endpoints require authentication
- Users can only access their own data
- Employers can only manage applications for jobs they created
- Input validation is implemented on all endpoints
- SQL injection protection through Mongoose ODM
