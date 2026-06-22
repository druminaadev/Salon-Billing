# SalonPro Billing & Expense Management System

A robust, scalable web application engineered for salons and independent stylists to manage daily billing, service tracking, staff commissions, and business expenses. 

Built with a modern stack leveraging **React 18, Vite, and TypeScript** on the frontend, and backed by **Supabase (PostgreSQL)** for secure, real-time data persistence and Row Level Security (RLS). The application utilizes Vanilla CSS with CSS Variables to provide a lightweight, dependency-free styling system.

---

## 📑 Quick Navigation (Project Documentation)
The project contains several detailed documentation files for specific tasks. Start here if you are looking for:

- 🗄️ **[Database Setup & Schema](DATABASE_SETUP.md)**: Full guide to setting up Supabase, RLS, and tables.
- 🏗️ **[Architecture & Security](ARCHITECTURE.md)**: Technical justification of the stack, security practices, and OWASP mitigations.
- 🔧 **[Features & Staff Split Logic](FEATURES_README.md)**: How the advanced staff commission splitting works.
- 📥 **[CSV Import Guide](CSV_IMPORT_GUIDE.md)**: Guide on importing historical billing and expense data from Excel/CSV.
- 🚀 **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)**: Steps required before taking the app live to production.
- 📂 **[Database Files Guide](DATABASE_FILES_GUIDE.md)**: What every `.sql` file in the `supabase/` folder does.
- 📜 **[API Endpoints & Logic Documentation](IMPLEMENTATION_COMPLETE.md)**: Development milestone summaries and API logic.
- 🗺️ **[Feature Roadmap](ROADMAP.md)**: Planned future features and enhancements.

---

## ✨ Key Technical Features

### 💰 Financial Management & Billing
- **Financial Dashboard:** Real-time aggregation of Total Income, Total Expenses, and Net Profit.
- **Dedicated Management Forms:** Controlled React components for handling complex state across Billing and Expense forms.
- **Inclusive Service Catalog:** Dynamically categorized service selection supporting flexible styling and treatment additions.

### 👥 Advanced Staff Split System
- **Dynamic Service Splits:** Custom JSONB logic allowing multiple staff to split commissions on a single service.
- **Exact Rupee Tracking:** Track exact amounts per staff member ensuring accurate payroll calculation.
- **Auto-Calculations:** React state hooks handle dynamic re-balancing of split amounts when modifications occur.

### 🛡️ Robust Backend Integration (Supabase)
- **Persistent Storage:** Data stored in PostgreSQL, secured by Row Level Security (RLS) policies enforcing tenant/user access.
- **Financial Auditability:** Immutable serial numbers ensuring legal and financial compliance (deleted records leave deliberate, auditable gaps).
- **High Performance:** GIN (Generalized Inverted Index) indexing on JSONB columns for fast and efficient staff queries.

### 📄 Professional Export & Invoicing
- **PDF Generation:** Client-side PDF generation using `jsPDF` and `jspdf-autotable`.
- **Data Export:** Seamless export to Excel (`.xlsx`) via `SheetJS`.
- **Optimized Bundling:** Export libraries are dynamically lazy-loaded using Vite's manual chunking to keep the initial application bundle lightweight.

---

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, RLS)
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, CSS Transitions)
- **Icons:** `lucide-react`
- **Date Management:** `date-fns`
- **Data Visualization**: `recharts`
- **Export Utilities:** `jspdf`, `jspdf-autotable`, `xlsx`
- **Testing:** Vitest, React Testing Library (Setup in progress)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine. You will also need a **Supabase** project.

### 1. Database Setup
1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of `supabase/MASTER_SCHEMA.sql` and run it. This creates all tables, RLS policies, indexes, and the staff split features.
*(See [DATABASE_SETUP.md](DATABASE_SETUP.md) for more details).*

### 2. Installation
Navigate to the project directory:
```bash
cd "salon billing"
```

Install the required dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to a new `.env` file and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to the local server address (usually `http://localhost:5173`).

---

## 🏗 Building for Production

To create an optimized production build, run:
```bash
npm run build
```

The application uses Rollup manual chunks and React `lazy` imports to heavily optimize the bundle size. The static files will be output into the `dist/` directory, ready to be deployed to Vercel, Netlify, or any static hosting provider.

*(See the [Deployment Checklist](DEPLOYMENT_CHECKLIST.md) for pre-launch checks).*

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── forms/           # Form components (BillingForm, ExpenseForm, ServiceSelect)
│   ├── Dashboard.tsx    # Main analytics and recent transactions view
│   ├── Billings.tsx     # Billings table list view
│   ├── Expenses.tsx     # Expenses table list view
│   ├── BillingView.tsx  # Detailed invoice view with PDF generation
│   ├── ExpenseView.tsx  # Detailed expense voucher view with PDF generation
│   ├── Layout.tsx       # Main app shell wrapping
│   └── Sidebar.tsx      # Collapsible navigation sidebar
├── data/
│   └── services.ts      # Categorized service lists and pricing
├── lib/
│   ├── database.ts      # Database CRUD abstraction layer
│   └── supabase.ts      # Supabase client initialization & types
├── utils/
│   ├── exportUtils.ts   # Async PDF/Excel/CSV export utilities
│   └── security.ts      # Input sanitization and security helpers
├── App.tsx              # Application entry point, routing, state, & date filters
└── index.css            # Global stylesheet and theme variables
```