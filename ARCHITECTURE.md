# Architectural & Security Guidelines
**SalonPro Billing & Expense Management System**

This document outlines the architectural decisions and security best practices adopted by the SalonPro system. It is designed to guide future development, ensure maintainability, and guarantee the security of sensitive financial and client data.

---

## 1. Architectural Decisions & Tech Stack Justification

### 1.1 Frontend: React 18 + Vite + TypeScript
*   **React 18**: Provides a robust, component-driven architecture. The use of hooks allows for highly reusable stateful logic (such as managing complex form states in Billing and Expenses).
*   **Vite**: Chosen over Webpack for its significantly faster cold server start times and Hot Module Replacement (HMR). Vite leverages native ES modules during development and uses Rollup for highly optimized, code-split production builds.
*   **TypeScript**: Essential for a financial application. Strong typing drastically reduces runtime errors related to data shapes (e.g., ensuring `subtotal`, `tax`, and `grandTotal` are strictly numbers, and `staffAssignments` conform to a specific interface).

### 1.2 Backend & Database: Supabase (PostgreSQL)
*   **Why Supabase?**: Supabase was chosen over Firebase because it provides a full, relational PostgreSQL database rather than a NoSQL document store. Financial applications benefit immensely from relational integrity, foreign keys, and complex aggregations.
*   **Data Integrity**: We utilize PostgreSQL triggers and constraints (e.g., `CHECK (amount >= 0)`) to enforce data rules at the database level, preventing malformed data regardless of frontend bugs.
*   **Auditability**: Serial numbers for invoices and vouchers are generated immutably. If a record is deleted, its serial number is lost, leaving a deliberate gap. This is a crucial requirement for financial auditing, ensuring that no transaction history can be secretly rewritten.

### 1.3 Styling: Vanilla CSS
*   **Why Vanilla CSS?**: While utility frameworks like Tailwind CSS are popular, Vanilla CSS combined with CSS Variables provides complete, granular control over the design system without locking the project into a specific build step or utility class syntax. The app utilizes a "glassmorphism" aesthetic built directly into `index.css`, ensuring the bundle remains extremely lightweight.

---

## 2. Security Practices & OWASP Mitigations

### 2.1 Authentication & Authorization
*   **Authentication**: Managed securely by Supabase Auth (leveraging secure JWTs).
*   **Row Level Security (RLS)**: Database access is strictly controlled via PostgreSQL RLS policies. Even if the frontend application logic is compromised, the database will refuse to return or modify rows that the current user's JWT does not have permission to access.

### 2.2 Injection Prevention (SQLi & XSS)
*   **SQL Injection**: Prevented entirely by using the Supabase JS Client, which uses parameterized queries under the hood via PostgREST. No raw SQL strings are ever concatenated on the frontend or backend.
*   **Cross-Site Scripting (XSS)**: React inherently protects against XSS by auto-escaping all data rendered in the DOM. Furthermore, input sanitization helpers located in `src/utils/security.ts` are employed before saving specific user-generated text.

### 2.3 Input Validation
Validation occurs at multiple layers:
1.  **Frontend**: HTML5 validation attributes (`required`, `min`, `max`, `pattern`) provide immediate feedback. React component logic ensures logical validity (e.g., staff split amounts must exactly equal the service total).
2.  **Backend (Database)**: PostgreSQL `CHECK` constraints ensure that numeric values (prices, amounts, quantities) cannot be negative, and text fields do not exceed maximum lengths.

### 2.4 Secrets Management
*   No secrets or API keys are hardcoded. Environment variables (`.env`) are used locally, and secret managers provided by the hosting platform (e.g., Vercel/Netlify Environment Variables) are used in production.
*   The `VITE_SUPABASE_ANON_KEY` is intentionally public and safe to expose, as the actual security is enforced by RLS policies on the server.

### 2.5 HTTPS & Data in Transit
*   The application is deployed to environments that enforce HTTPS. All communication with the Supabase API occurs over encrypted TLS connections.

---

## 3. Performance & Scalability Strategy

*   **Lazy Loading**: Heavy client-side libraries (`jspdf`, `xlsx`, `recharts`) are lazily loaded. The initial JavaScript bundle only contains the core React app, significantly improving Time To Interactive (TTI).
*   **Database Indexing**: Important query fields (`created_at`, `serial_number`) are indexed. The complex `staff_assignments` JSONB field utilizes a GIN (Generalized Inverted Index) for fast, scalable searching.
*   **API-First Approach**: The database is interacted with exclusively via the Supabase REST/GraphQL APIs, allowing client applications (like a future Mobile App) to scale independently.

---

## 4. Code Quality & Maintainability

*   **Strict Mode**: React Strict Mode is enabled to identify potential lifecycle issues early.
*   **ESLint & Prettier**: Enforced code style and linting rules prevent common anti-patterns and maintain a consistent codebase.
*   **Modular Architecture**: Business logic, UI components, and database queries are strictly separated into `utils/`, `components/`, and `lib/` directories respectively.
