# Pathway - College Discovery Platform

Pathway is a modern, full-stack web application designed to help students discover, compare, and discuss engineering colleges across India. Built with Next.js 14 and powered by AI, Pathway simplifies the complex process of college selection.

## 🌟 Features

- **Smart College Discovery**: Browse top colleges with rich details including fees, placement statistics, and user ratings.
- **AI Assistant Chatbot**: Leveraging Google Gemini GenAI, students can chat with a smart assistant to ask questions about colleges, cutoffs, and placements.
- **Compare Colleges**: Add up to 3 colleges side-by-side to compare fees, ratings, and average packages.
- **Community Discussions**: A built-in Q&A forum where students can ask questions and reply to existing threads.
- **Save & Favorite**: Authenticated users can save their favorite colleges to a personalized dashboard for easy access later.
- **Secure Authentication**: Robust user authentication handled via NextAuth.js.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL (hosted on Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (Credentials Provider)
- **AI Integration**: Google GenAI SDK (`@google/genai`)
- **Icons & UI**: Lucide React, React Hot Toast

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A PostgreSQL database URL (we recommend Neon)
- A Google Gemini API Key (from Google AI Studio)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment variables by creating a `.env` file at the root of the project:
   ```env
   DATABASE_URL="postgresql://username:password@your-neon-hostname.neon.tech/neondb?sslmode=require"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="your-gemini-api-key"
   ```

3. Push the Prisma schema to your database to create the necessary tables:
   ```bash
   npx prisma db push
   ```

4. Populate the database with initial college data:
   ```bash
   npx prisma db seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application!

## 📂 Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable UI components (Navbar, CollegeCard, etc.)
- `/src/lib`: Utility functions and Prisma client initialization
- `/src/store`: Zustand state management for the comparison feature
- `/prisma`: Database schema and seed scripts
