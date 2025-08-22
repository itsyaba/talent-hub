# Talent Hub - Job Search Platform

A modern, responsive job search platform built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Responsive Hero Section**: Beautiful landing page with job search functionality
- **Modern Navbar**: Clean navigation with mobile-responsive menu
- **Job Search Interface**: Advanced search with location and keyword inputs
- **Popular Searches**: Interactive tags for common job searches
- **Professional Design**: Pixel-perfect recreation of modern job platform UI
- **Mobile First**: Fully responsive design for all screen sizes

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Fonts**: Poppins (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd talent-hub
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles and Tailwind config
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── components/
│   ├── Navbar.tsx       # Navigation component
│   ├── HeroSection.tsx  # Hero section with search
│   └── index.ts         # Component exports
└── lib/
    └── utils.ts         # Utility functions
```

## Components

### Navbar

- Responsive navigation with mobile menu
- Jobster logo with gradient text
- Navigation links and sign-in button
- Mobile hamburger menu

### HeroSection

- Main headline and description
- Job search form with location input
- Popular search tags
- Company logos section
- Visual elements with professional woman image
- Job statistics card

## Customization

The design uses CSS custom properties for colors:

- `--primary`: Main brand color (blue)
- `--accent`: Accent color for highlights
- `--card`: Card background color
- `--foreground`: Main text color
- `--muted-foreground`: Secondary text color

## Responsive Design

- **Mobile**: Stacked layout with centered content
- **Tablet**: Improved spacing and layout
- **Desktop**: Two-column grid layout with visual elements

## License

This project is open source and available under the [MIT License](LICENSE).
