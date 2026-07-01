# OnferenceTV Event Management Application

A complete, full-stack Event Management application built for the OnferenceTV assignment. It allows users to create, view, edit, and delete events. 

## Features
- **Event CRUD Operations**: Create, read, update, and delete events.
- **Form Validation**: Strict validation using Zod on both the frontend and backend.
- **PDF Export**: Generate and download a beautiful PDF containing event details.
- **AI Content Generation**: Automatically generate event descriptions and speaker introductions (with a local fallback if no AI API key is provided).
- **Modern UI**: Clean, responsive design using Tailwind CSS and shadcn/ui.
- **State Management**: TanStack Query for robust server state management and caching, Redux Toolkit for UI dialog state.

## Technology Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Redux Toolkit, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Zod.

## Folder Structure
```
onferencetv-event-management/
├── backend/            # Express, Prisma, PostgreSQL setup
└── frontend/           # React, Vite, Tailwind CSS, shadcn/ui setup
```

## Prerequisites
- Node.js (v18+)
- PostgreSQL (Local or remote instance)

## Setup Instructions

### 1. Database Setup
Ensure you have a PostgreSQL instance running. Create an empty database (e.g., `onferencetv_events`).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables example file:
   ```bash
   cp .env.example .env
   ```
4. Update the `DATABASE_URL` in `.env` to point to your PostgreSQL database.
   *(Optional)* Add an `OPENAI_API_KEY` and set `AI_PROVIDER=openai` to use real AI generation instead of the deterministic placeholder.
5. Run Prisma migrations to set up the database schema:
   ```bash
   npm run prisma:migrate
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend will start on `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Prisma Scripts
The backend package.json includes the following useful Prisma commands:
- `npm run prisma:generate`: Generates the Prisma client.
- `npm run prisma:migrate`: Runs database migrations against your schema.
- `npm run prisma:studio`: Opens Prisma Studio (a visual database viewer) in your browser.

## API Endpoints
- `GET /api/events` - Retrieve all events.
- `GET /api/events/:id` - Retrieve a specific event.
- `POST /api/events` - Create a new event.
- `PUT /api/events/:id` - Update an existing event.
- `DELETE /api/events/:id` - Delete an event.
- `POST /api/events/:id/generate-content` - Generate AI content for an event.

## Assumptions Made
- There is only one user role (Event Manager); no complex authentication or authorization is required.
- Standard PostgreSQL configuration is available on the machine running the app.
- AI Generation gracefully falls back to deterministic placeholders if no API key is provided, fulfilling the requirement for a local generator.
