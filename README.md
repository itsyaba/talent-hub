# TalentHub - Mini Job Portal Platform

A modern, full-stack job portal platform where companies can post job listings, developers can apply for jobs, and employers can manage applications. Built with Next.js 15, TypeScript, MongoDB, and Tailwind CSS.

## 🎯 Project Overview

TalentHub is a comprehensive job portal that connects talented developers with innovative companies. The platform features role-based access control, real-time notifications, file uploads, and a professional dashboard for both employers and job seekers.

## ✨ Features

### **For Job Seekers (Talent)**

- Browse and search available job listings
- Apply to jobs with resume upload and cover letter
- Track application status and history
- Personal dashboard with application analytics
- Real-time notifications for application updates

### **For Employers**

- Post and manage job listings
- Review and manage job applications
- Company profile management
- Dashboard with application analytics
- Real-time notifications for new applications

### **For Admins**

- Oversee all jobs and applications
- Manage user accounts and roles
- System-wide analytics and monitoring

### **Platform Features**

- Responsive design for all devices
- Dark/Light theme toggle
- Advanced job search and filtering
- File upload system for resumes
- Real-time notifications
- Professional UI/UX design

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Next.js API routes, MongoDB with Mongoose
- **Authentication**: Better Auth with session management
- **File Storage**: UploadThing for resume uploads
- **Database**: MongoDB with proper indexing
- **Deployment**: Ready for Vercel (frontend) + Render/Heroku (backend)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd talent-hub
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env.local` file:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
AUTH_SECRET=your_auth_secret_key
AUTH_URL=http://localhost:3000

# File Upload
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Email (Optional)
RESEND_API_KEY=your_resend_api_key
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── api/               # API endpoints
│   ├── dashboard/         # User dashboards
│   ├── jobs/              # Job-related pages
│   └── onboarding/        # User onboarding
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   └── ...                # Feature components
├── models/                 # MongoDB schemas
├── lib/                    # Utility functions
└── hooks/                  # Custom React hooks
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signin` - User sign in
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signout` - User sign out

### Jobs

- `GET /api/jobs` - List all jobs with filtering and pagination
- `POST /api/jobs` - Create a new job (employer only)
- `GET /api/jobs/[id]` - Get job details
- `PATCH /api/jobs/[id]` - Update job (employer only)
- `DELETE /api/jobs/[id]` - Delete job (employer only)

### Applications

- `GET /api/applications` - List applications with filtering
- `POST /api/applications` - Apply for a job
- `GET /api/applications/[id]` - Get application details
- `PATCH /api/applications/[id]` - Update application status

### User Management

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/applications` - Get user's applications

### Employer Dashboard

- `GET /api/employer/dashboard` - Get employer dashboard data
- `GET /api/employer/company-profile` - Get company profile
- `PATCH /api/employer/company-profile` - Update company profile
- `GET /api/employer/jobs` - Get employer's jobs

### Notifications

- `GET /api/notifications` - Get user notifications
- `PATCH /api/notifications/[id]` - Mark notification as read

### Data Management

- `POST /api/seed` - Seed database with sample data (development)

## 🗄️ Database Models

### User

- Basic info: email, name, password, image
- Role: user, employer, admin
- Company profile (for employers)
- Onboarding status

### Job

- Title, description, requirements
- Location, type, salary range
- Company information
- Status: active, paused, closed
- Tags and experience level

### Application

- Job and user references
- Status: applied, shortlisted, interviewed, rejected, hired
- Cover letter, resume, experience
- Skills and expected salary

### Notification

- User reference
- Type and message
- Read status and timestamps

## 🎨 UI Components

### Core Components

- **Navbar**: Navigation with user menu and theme toggle
- **HeroSection**: Landing page with job search
- **JobOffersSection**: Dynamic job listings
- **ApplicationModal**: Job application form
- **Dashboard**: Role-based user dashboards
- **ThemeSwitcher**: Dark/light mode toggle

### Features

- Responsive grid layouts
- Loading states and skeletons
- Error handling and empty states
- Form validation and feedback
- Real-time updates

## 🔐 Authentication & Authorization

- **Session-based authentication** using Better Auth
- **Role-based access control** (user, employer, admin)
- **Protected routes** for sensitive operations
- **JWT tokens** for secure communication
- **Password hashing** and validation

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoint system** for all screen sizes
- **Touch-friendly interfaces** for mobile devices
- **Optimized layouts** for tablets and desktops

## 🚀 Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy to Vercel
```

### Backend (Render/Heroku)

- Set environment variables
- Connect MongoDB database
- Deploy API routes

## 🧪 Testing

1. **Start the application**: `npm run dev`
2. **Seed the database**: Visit `/api/seed`
3. **Test user flows**:
   - User registration and login
   - Job posting (employer)
   - Job application (talent)
   - Dashboard functionality
   - File uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

For questions or issues:

- Check the [API Documentation](./API_DOCUMENTATION.md)
- Review the [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- Open an issue on GitHub

---

**TalentHub** - Connecting Talent with Opportunity 🚀
