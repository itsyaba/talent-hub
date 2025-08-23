# Featured Jobs Setup Instructions

## Overview

The home page now displays real jobs from the database instead of hardcoded data. The featured jobs section will show up to 12 active jobs from your database.

## Database Setup

### 1. Seed the Database with Sample Jobs

To populate your database with sample jobs, you can use the seed endpoint:

**Development Environment:**

```bash
# GET request to seed data (development only)
GET /api/seed
```

**Production Environment (requires authentication):**

```bash
# POST request with employer authentication
POST /api/seed
{
  "action": "seed"
}
```

### 2. Sample Jobs Included

The seed data includes 8 diverse job postings:

- Senior Frontend Developer (TechCorp Inc.)
- React Native Developer (TechCorp Inc.)
- UI/UX Designer (TechCorp Inc.)
- Backend Developer (TechCorp Inc.)
- DevOps Engineer (TechCorp Inc.)
- Financial Analyst (FinanceHub Ltd.)
- Marketing Manager (Growth Marketing Co.)
- Data Scientist (DataInsights Inc.)

## Features

### Dynamic Job Display

- Jobs are fetched from the `/api/jobs` endpoint
- Only active jobs are displayed
- Jobs are sorted by creation date (newest first)
- Responsive grid layout (1-4 columns based on screen size)

### Smart Categorization

- Job categories are automatically determined based on:
  - Job tags
  - Company industry
  - Job requirements
- Appropriate icons are displayed for each category

### Company Information

- Company names are extracted from job data
- Company logos are generated using initials
- Dynamic background colors for company logos

### Loading States

- Skeleton loading animation while fetching jobs
- Error handling for failed API requests
- Empty state when no jobs are available

## API Endpoints

### GET /api/jobs

Fetches jobs with optional filtering:

- `status`: Filter by job status (e.g., "active")
- `type`: Filter by job type (e.g., "full-time")
- `location`: Filter by location
- `search`: Text search across job fields
- `limit`: Number of jobs to return (default: 10)
- `page`: Page number for pagination

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "_id": "job_id",
      "title": "Job Title",
      "description": "Job Description",
      "location": "Job Location",
      "type": "full-time",
      "company": {
        "name": "Company Name",
        "industry": "Company Industry"
      },
      "tags": ["tag1", "tag2"],
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
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

## Testing

### 1. Start the Application

```bash
npm run dev
```

### 2. Seed the Database

Visit `/api/seed` in your browser or use a tool like Postman to seed the database.

### 3. View the Home Page

Navigate to the home page to see the featured jobs section populated with real data.

### 4. Verify Functionality

- Check that jobs are loading from the database
- Verify that job information is displayed correctly
- Test responsive design on different screen sizes
- Confirm that loading states and error handling work

## Troubleshooting

### No Jobs Displayed

1. Check if the database is connected
2. Verify that jobs exist in the database
3. Check the browser console for API errors
4. Ensure the `/api/jobs` endpoint is working

### Jobs Not Updating

1. Clear browser cache
2. Check if new jobs are being created
3. Verify job status is set to "active"
4. Check database connection

### Performance Issues

1. Consider implementing pagination for large job lists
2. Add caching for job data
3. Optimize database queries
4. Implement job search and filtering

## Customization

### Adding More Jobs

1. Use the existing seed data as a template
2. Add new job objects to the `sampleJobs` array
3. Include all required fields (title, description, location, company)
4. Add relevant tags for proper categorization

### Modifying Job Display

1. Update the `JobOffersSection.tsx` component
2. Modify the job card layout and styling
3. Add new fields to the job display
4. Customize the categorization logic

### Styling Changes

1. Modify the CSS classes in the component
2. Update the Tailwind CSS classes
3. Customize the animation variants
4. Adjust the responsive breakpoints
