# QOMP Project Knowledge Base

> **Note to AI Agents:** This file serves as the core documentation for the QOMP project. Read this file to understand the architecture, tech stack, and key features that have already been implemented to avoid breaking existing rules or reinventing the wheel.

## 1. Project Overview
QOMP is a Full-Stack Customer and Environment Management System. It allows users to track customers, manage their infrastructure environments, track SSL certificates, log Jira tickets, and manage tasks, meetings, and customer resources.

## 2. Tech Stack
- **Frontend:** React, Vite, TypeScript
- **Backend:** Node.js, Express, TypeScript (ES Modules)
- **Database:** SQLite (managed via Prisma ORM)
- **Styling:** Vanilla CSS (`index.css`) prioritizing modern UI/UX (Clean, Dark mode themes, Glassmorphism, Micro-animations).

## 3. Architectural Rules (CRITICAL)
The user is very strict about **Clean Architecture**, **Micro Components**, and **Best Practices**.

### Frontend Architecture
- Avoid large monolithic components.
- Use **Micro Components**: Break large pages (like `CustomerProfile.tsx` or `EnvironmentDetails.tsx`) into smaller, single-purpose components placed in subfolders (e.g., `components/profile/` or `components/details/`).
- Use shared components for UI elements (like `Modal.tsx`).

### Backend Architecture
- **Separation of Concerns:** 
  - `server/src/index.ts` is ONLY for orchestration and mounting routes.
  - `server/src/routes/` handles endpoint definitions.
  - `server/src/controllers/` handles request/response logic.
  - `server/src/services/` handles background jobs and business logic.
  - `server/src/middlewares/` handles things like file uploading (`multer`).
- **ES Modules:** The backend uses `"type": "module"`. All local imports must include `.ts` extensions (e.g., `import { x } from './controller.ts'`). `__dirname` and `__filename` must be manually constructed using `fileURLToPath(import.meta.url)`.

## 4. Key Features Implemented

### 1. SSL Certificates & Expiry Cron Job
- **Management:** Users can Add, Edit, and Delete SSL certificates under an Environment.
- **Cron Job:** `server/src/services/sslCronService.ts` runs daily at midnight (`node-cron`). It calculates the remaining days for SSL certificates. If a certificate expires in exactly 10, 5, or 1 days, it generates a `Notification` for all `Admin` users with a direct link to the Environment.

### 2. Customer Resources & File Uploads
- Users can add resources to a Customer Profile.
- **Dual Mode:** Users can add an "External Link" (Zoom, Drive) OR use "File Upload" to upload physical files (PDFs, Images, Videos).
- **Storage:** Files are uploaded using `multer` (`server/src/middlewares/uploadMiddleware.ts`) and saved locally to `server/uploads/`. The `uploads` directory is served statically by Express.

### 3. Global Search
- A global search bar in the navbar hits the backend `/api/search` endpoint and allows quick navigation to Customers and Environments.

### 4. Interactive Dashboard
- Dashboard widgets are fully interactive and route the user to specific filtered views when clicked.

## 5. Database Schema (Prisma)
Key models include:
- `User`, `Notification`, `Permission`
- `Customer` (Has many Contacts, Schools, Tasks, Meetings, Renewals, Resources)
- `CustomerResource` (Stores file uploads or external links)
- `Environment` (Linked to Customer; Has many Certificates, JiraTickets)
- `Certificate` (Tracks SSL data)
- `JiraTicket` (Tracks infrastructure tickets)

Run `npx prisma db push` and `npx prisma generate` after any schema changes.
