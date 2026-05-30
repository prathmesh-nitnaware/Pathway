# Pathway - College Discovery Platform

Pathway is a full-stack web application that helps students discover, compare, and discuss engineering colleges across India. It features AI-powered assistance, community discussions, and a role-based admin analytics portal.

---

## Features

### For Students
- **College Listings with Search & Filters** — Browse colleges with real-time search, location filters, fee range filters, and pagination.
- **College Detail Pages** — View detailed information including overview, courses offered, placement statistics, and user reviews.
- **Compare Colleges** — Select up to 3 colleges for a side-by-side comparison of fees, ratings, placements, and more.
- **Community Q&A Forum** — Ask questions, browse discussions, and reply to existing threads.
- **Save & Favorite** — Authenticated users can save colleges to a personal dashboard for quick reference.
- **AI Chatbot** — A floating chatbot assistant powered by Google Gemini AI that answers queries about colleges, cutoffs, and placements. Available only to logged-in users.

### For Admins
- **Analytics Dashboard** — A dedicated `/admin` portal showing platform-wide statistics: total colleges, registered users, forum questions, and answers.
- **College Management** — Add or delete college records directly from the admin UI without touching the database.
- **Role-Based Access** — The admin portal is completely isolated from the student-facing UI. Navbar and chatbot are hidden on admin pages.

---

## Tech Stack

| Layer           | Technology                                                  |
|-----------------|-------------------------------------------------------------|
| Frontend        | Next.js 16 (App Router), React 19, Tailwind CSS 4          |
| Backend         | Next.js API Route Handlers (Serverless Functions)           |
| Database        | PostgreSQL (Neon)                                           |
| ORM             | Prisma 5                                                    |
| Authentication  | NextAuth.js 4 (Credentials Provider with bcrypt)            |
| AI Integration  | Google Gemini AI (`@google/genai` SDK, `gemini-2.0-flash`)  |
| State Mgmt      | Zustand                                                     |
| UI Components   | Lucide React (icons), React Hot Toast (notifications)       |

---

## Database Schema

The application uses 7 relational models:

```
User ──┬── SavedCollege ──── College ──┬── Course
       ├── Review ───────────────────────┘
       ├── Question ──── Answer
       └── (role: USER | ADMIN)
```

- **User** — Stores credentials, role (`USER`/`ADMIN`), and relations to saved colleges, reviews, questions, and answers.
- **College** — Core entity with name, location, fees, rating, image, placement stats, and year of establishment.
- **Course** — Belongs to a college; stores course name, duration, and fees.
- **Review** — User-submitted rating and review text for a college.
- **SavedCollege** — Join table linking users to their saved/favorited colleges.
- **Question** — Forum post created by a user with a title and body.
- **Answer** — Reply to a question, authored by a user.

---

## Project Structure

```
college-discovery/
├── prisma/
│   ├── schema.prisma          # Database schema with all models
│   └── seed.ts                # Seed script with real college data
├── src/
│   ├── app/
│   │   ├── admin/             # Admin analytics portal (layout + page)
│   │   ├── api/
│   │   │   ├── admin/         # Admin-only API routes (colleges CRUD, stats)
│   │   │   ├── auth/          # NextAuth.js authentication handler
│   │   │   ├── chat/          # Gemini AI chatbot endpoint
│   │   │   ├── colleges/      # College listing and detail APIs
│   │   │   ├── compare/       # Comparison data API
│   │   │   ├── discussions/   # Q&A forum CRUD (questions + answers)
│   │   │   └── save/          # Save/unsave college endpoints
│   │   ├── colleges/          # College listing and detail pages
│   │   ├── compare/           # Side-by-side comparison page
│   │   ├── discussions/       # Q&A forum pages
│   │   ├── login/             # Login page
│   │   ├── saved/             # Saved colleges dashboard
│   │   ├── signup/            # Registration page
│   │   ├── layout.tsx         # Root layout (Navbar, Chatbot, Providers)
│   │   └── page.tsx           # Homepage with search and filters
│   ├── components/
│   │   ├── Chatbot.tsx        # Floating AI chatbot widget
│   │   ├── Navbar.tsx         # Global navigation bar
│   │   ├── Providers.tsx      # NextAuth session provider wrapper
│   │   └── colleges/          # CollegeCard, CollegeCardSkeleton
│   ├── lib/
│   │   ├── auth.ts            # NextAuth configuration and options
│   │   └── prisma.ts          # Prisma client singleton
│   └── store/
│       └── useCompareStore.ts # Zustand store for comparison feature
├── .env                       # Environment variables (not committed)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (we use [Neon](https://neon.tech) — free tier available)
- A Google Gemini API Key ([get one here](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/prathmesh-nitnaware/Pathway.git
cd Pathway
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
NEXTAUTH_SECRET="generate-a-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### Database Setup

```bash
npx prisma db push      # Create tables from schema
npx prisma db seed       # Populate with sample college data
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Endpoints

| Method | Endpoint                          | Auth Required | Description                        |
|--------|-----------------------------------|---------------|------------------------------------|
| GET    | `/api/colleges`                   | No            | List colleges (paginated, filterable) |
| GET    | `/api/colleges/:id`               | No            | Get single college details         |
| POST   | `/api/chat`                       | Yes           | Send message to AI chatbot         |
| GET    | `/api/discussions`                | No            | List all forum questions           |
| POST   | `/api/discussions`                | Yes           | Create a new question              |
| POST   | `/api/discussions/:id/answers`    | Yes           | Post an answer to a question       |
| GET    | `/api/compare`                    | No            | Get comparison data for college IDs|
| GET    | `/api/save`                       | Yes           | Get user's saved colleges          |
| POST   | `/api/save`                       | Yes           | Save a college                     |
| DELETE | `/api/save/:id`                   | Yes           | Remove a saved college             |
| GET    | `/api/admin/colleges`             | Admin         | List all colleges (admin view)     |
| POST   | `/api/admin/colleges`             | Admin         | Add a new college                  |
| DELETE | `/api/admin/colleges`             | Admin         | Delete a college                   |
| GET    | `/api/admin/stats`                | Admin         | Get platform analytics             |

---

## Deployment

This is a Next.js full-stack application. Deploy the entire app on **Vercel** — it handles both the frontend and all API routes as serverless functions automatically.

1. Push to GitHub.
2. Import the repository on [vercel.com](https://vercel.com).
3. Add the 4 environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GEMINI_API_KEY`).
4. Deploy.

---

## Default Accounts

After running the seed script, the following accounts are available:

| Role  | Email                | Password      |
|-------|----------------------|---------------|
| Admin | `admin@pathway.com`  | `admin123`    |
| User  | `test@example.com`   | `password123` |

---

## License

This project is built for educational and demonstration purposes.
