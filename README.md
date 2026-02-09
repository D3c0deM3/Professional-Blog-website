# Academic Portfolio Website

A professional academic portfolio website for a PhD professor in Data Structures & Algorithms, built with Next.js, TypeScript, Tailwind CSS, and SQLite.

## Features

### Public Website
- **Home**: Hero section with animated geometric visuals
- **About**: Professor biography with stats and photo
- **Research Papers**: Publications with search and filtering
- **Academic Materials**: Downloadable resources organized by category
- **Projects**: Showcase of algorithm implementations
- **Achievements**: Timeline of awards and recognition
- **Q&A**: Frequently asked questions with accordion
- **Ask a Question**: Form for students to submit questions
- **Contact**: Contact information and social links

### Admin Panel
- Secure authentication with NextAuth.js
- Dashboard with statistics overview
- CRUD operations for all content types
- File upload system for PDFs and images
- Question review and publish workflow
- Rich text editing capabilities

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Animations**: CSS animations with Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma db seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Admin Credentials
- **Email**: admin@university.edu
- **Password**: admin123

## Project Structure

```
my-app/
├── prisma/
│   ├── schema.prisma    # Database schema
│   ├── seed.ts          # Seed data
│   └── data.db          # SQLite database (gitignored)
├── public/
│   └── uploads/         # Uploaded files
├── src/
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── admin/       # Admin panel pages
│   │   ├── globals.css  # Global styles
│   │   ├── layout.tsx   # Root layout
│   │   └── page.tsx     # Home page
│   ├── components/      # Reusable components
│   ├── lib/             # Utilities and helpers
│   ├── sections/        # Page sections
│   └── types/           # TypeScript types
├── .env                 # Environment variables
├── next.config.js       # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
└── tsconfig.json        # TypeScript configuration
```

## Database Schema

### Models
- **User**: Admin users for authentication
- **Page**: CMS pages (About, etc.)
- **Paper**: Research publications
- **Category**: Material categories
- **Material**: Downloadable academic materials
- **Project**: Showcase projects
- **Achievement**: Awards and recognition
- **QuestionSubmission**: Submitted questions from users
- **QA**: Published Q&A items
- **Contact**: Contact information
- **SiteSetting**: Site-wide settings

## API Routes

### Public API
- `GET /api/about` - About page content
- `GET /api/papers` - Research papers
- `GET /api/categories` - Material categories
- `GET /api/materials` - Academic materials
- `GET /api/projects` - Projects
- `GET /api/achievements` - Achievements
- `GET /api/qa` - Q&A items
- `POST /api/questions` - Submit a question
- `GET /api/contact` - Contact information

### Admin API
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/papers` - List all papers
- `POST /api/admin/papers` - Create paper
- `PATCH /api/admin/papers/[id]` - Update paper
- `DELETE /api/admin/papers/[id]` - Delete paper
- Similar routes for materials, projects, achievements, QA, and questions

## File Upload

Uploaded files are stored in `/public/uploads` with only the file path stored in the database. Supported file types:
- PDF documents
- Images (JPEG, PNG, WebP)
- Text files
- ZIP archives

Maximum file size: 10MB

## Customization

### Fonts
The site uses:
- **Basement Grotesque** for headings (display font)
- **Uncut Sans** for body text

### Colors
- Primary: Black (#000000)
- Secondary: Gray (#666666)
- Accent: Red (#FF0000)
- Background: White (#FFFFFF) and Light Gray (#F5F5F5)

### Animations
- Entrance animations with staggered delays
- Scroll-triggered reveals
- Hover effects on cards and buttons
- Floating decorative elements
- Smooth page transitions

## Deployment

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

### Environment Variables
Create a `.env.local` file for production:
```
DATABASE_URL="file:./prisma/data.db"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## License

MIT License - feel free to use this template for your own academic portfolio.
