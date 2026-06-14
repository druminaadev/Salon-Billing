# SalonPro Billing & Expense System

A premium, modern web application designed for salons and independent stylists to manage daily billing (income) and business expenses. Built with React, Vite, and TypeScript. 

The application utilizes a spa-inspired "calm" color palette (sage greens and warm dark grays) with a premium glassmorphism aesthetic.

## ✨ Key Features

- **Dashboard Overview:** Get a quick glance at your Total Income, Total Expenses, and Net Profit, alongside your most recent transactions.
- **Dedicated Forms:** Dedicated, clean UI tabs for "Add Billing" and "Add Expense" with comprehensive fields (Date, Amount, Description, Category, Payment Method: Cash/Online).
- **Global Date Filter:** Filter transactions across the Dashboard, Billings, and Expenses views by a specific Start Date and End Date.
- **Collapsible Sidebar:** A responsive, toggleable sidebar navigation menu designed for both desktop and mobile viewing.
- **Search & Filter:** Easily filter through your lists of billings and expenses using a real-time search field.
- **Data Export:** Export your billing and expense tables seamlessly into:
  - PDF (`.pdf`)
  - CSV (`.csv`)
  - Excel (`.xlsx`)

## 🛠 Tech Stack

- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Styling:** Vanilla CSS (CSS Variables, Flexbox/Grid, Glassmorphism, CSS Transitions)
- **Icons:** `lucide-react`
- **Date Management:** `date-fns`
- **Export Utilities:** `jspdf`, `jspdf-autotable`, `xlsx`

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI components
│   ├── forms/           # Form components (BillingForm, ExpenseForm)
│   ├── Dashboard.tsx    # Main analytics and recent transactions view
│   ├── Billings.tsx     # Billings table list view
│   ├── Expenses.tsx     # Expenses table list view
│   ├── Layout.tsx       # Main app shell wrapping
│   └── Sidebar.tsx      # Collapsible navigation sidebar
├── data/
│   └── mockData.ts      # Initial placeholder data for demonstration
├── types/
│   └── index.ts         # Global TypeScript interfaces
├── App.tsx              # Application entry point, routing, state, & date filters
├── index.css            # Global stylesheet and theme variables
└── main.tsx             # React DOM rendering
```

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed on your machine.

### Installation

1. Navigate to the project directory:
   ```bash
   cd "salon billing"
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server address (usually `http://localhost:5173`).

## 🏗 Building for Production

To create an optimized production build, run:
```bash
npm run build
```

This will output the static files into the `dist/` directory, which can be deployed to any static web hosting service (Vercel, Netlify, GitHub Pages, etc.).

## 📝 Note
This is currently a frontend-only application that relies on local React state. Any new records added during the session will reset upon refreshing the page, as there is no backend database connected yet.


reacreat ethe billings forms and expense form