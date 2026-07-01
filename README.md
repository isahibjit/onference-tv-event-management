# 🎯 OnferenceTV Event Management System

A modern full-stack **Event Management System** built as part of the **OnferenceTV Full Stack Developer Assessment**. The application enables users to create, manage, and organize events while leveraging **Google Gemini AI** for content generation and supporting **PDF exports** for event documentation.

## 🌐 Live Demo

**Application:**
https://onference-assignment.netlify.app/

## 📂 Source Code

GitHub Repository:
https://github.com/isahibjit/onference-tv-event-management

---

# ✨ Features

## 📊 Dashboard

* Modern SaaS-inspired dashboard
* Responsive design
* Dashboard statistics
* Recent events overview
* Search and filtering
* Clean UI built with shadcn/ui

---

## 📅 Event Management

* Create Events
* View Events
* Update Events
* Delete Events
* Event Details
* Form Validation
* Success & Error Notifications
* Empty States
* Loading Skeletons

Each event contains:

* Event Name
* Event Date
* Speaker Name
* Speaker Designation

---

## 🤖 AI Content Generation (Google Gemini)

Generate AI-powered content directly from event information.

Supported generations:

* Event Description
* Speaker Introduction

Features:

* Regenerate Content
* Copy Generated Content
* Save Generated Content

---

## 📄 PDF Export

Generate professional PDFs containing:

* Event Details
* Speaker Information
* AI Generated Description
* Speaker Introduction

---

## 📱 Responsive Design

Optimized for:

* Desktop
* Tablet
* Mobile

---

## 🎨 UI/UX

Built using modern SaaS design principles.

* shadcn/ui
* Tailwind CSS
* Rounded cards
* Responsive layouts
* Consistent spacing
* Dark/Light friendly architecture
* Accessible components

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* shadcn/ui
* React Router
* RTK Query
* React Hook Form
* Zod
* Lucide React

---

## Backend

* NestJS
* Prisma ORM
* PostgreSQL
* TypeScript

---

## AI

* Google Gemini API

---

## Database

* PostgreSQL

---

## Package Manager

* npm

---

# 📁 Project Structure

```
.
├── backend
│   ├── prisma
│   ├── src
│   └── package.json
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/isahibjit/onference-tv-event-management.git

cd onference-tv-event-management
```

---

# Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
DATABASE_URL=

GEMINI_API_KEY=

PORT=5000
```

Generate Prisma Client

```bash
npx prisma generate
```

Run Database Migrations

```bash
npx prisma migrate dev
```

(Optional) Seed Database

```bash
npx prisma db seed
```

Start Backend

```bash
npm run start:dev
```

---

# Frontend Setup

```bash
cd frontend

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run Development Server

```bash
npm run dev
```

---

# Production Build

Frontend

```bash
npm run build
```

Backend

```bash
npm run build
```

---

# API Features

* Create Event
* Get Events
* Get Event Details
* Update Event
* Delete Event
* Generate AI Content
* Export Event PDF

---

# Validation

The application validates:

* Required Fields
* Invalid Dates
* Empty Inputs
* Backend Errors
* API Errors

User-friendly validation messages are displayed throughout the application.

---

# Error Handling

Examples of handled scenarios:

* Missing required fields
* Invalid event dates
* Network failures
* Database errors
* AI generation failures
* PDF generation failures
* Resource not found

---

# AI Usage

This project was developed with the assistance of modern AI development tools.

AI-assisted tasks included:

* UI/UX brainstorming
* Component architecture
* Code optimization
* Documentation
* Prompt engineering
* Refactoring suggestions

All generated code was reviewed, modified, tested, and integrated manually.

---

# Assumptions

* Event dates are validated before creation.
* AI generation requires a valid Gemini API key.
* PDF generation is available only for existing events.
* PostgreSQL is used as the primary database.

---

# Future Improvements

Given additional time, the following enhancements could be added:

* User Authentication
* Role-Based Access Control
* Event Categories
* Event Images
* File Uploads
* Speaker Profiles
* Email Invitations
* Calendar Integration
* Event Analytics
* Pagination
* Advanced Search
* Audit Logs
* Activity Timeline
* Real-time Notifications
* Docker Support
* Unit & Integration Tests
* CI/CD Pipeline

---

# Evaluation Objectives Covered

✅ CRUD Operations

✅ Database Integration

✅ Input Validation

✅ Error Handling

✅ Responsive UI

✅ AI Integration (Google Gemini)

✅ PDF Export

✅ Clean Architecture

✅ Maintainable Code

✅ Modern Frontend Practices

---

# Author

**Sahibjit Singh**

GitHub: https://github.com/isahibjit

---

## Thank You

Thank you for taking the time to review this submission. I appreciate the opportunity to complete this assessment and look forward to your feedback.

<img width="1918" height="945" alt="image" src="https://github.com/user-attachments/assets/f3312064-8c1a-4d1c-95a8-c74dc32f108a" />
