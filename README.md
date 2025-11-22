# Shri Balaji Pipes and Electricals - Business Management App

A full-stack web application for managing inventory, sales, purchases, and expenses for a hardware store.

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB (Local or Atlas)

## Features
- **Authentication**: Admin and Staff roles.
- **Dashboard**: Real-time stats, charts for sales vs expenses, low stock alerts.
- **Inventory**: Manage products, categories, brands, and stock levels.
- **Sales (Billing)**: Create bills, automatic stock deduction, sales history.
- **Purchases**: Record supplier purchases, automatic stock addition.
- **Expenses**: Track shop expenses (rent, salary, etc.).
- **Reports**: Visual analytics of business performance.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB installed and running locally (or a cloud URI)

## Setup Instructions

### 1. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory (if not already present) with the following content:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/balaji_hardware
   JWT_SECRET=your_secret_key_here
   NODE_ENV=development
   ```
4. Seed the database with initial data (Optional but recommended):
   ```bash
   node seed.js
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`.

### 2. Frontend Setup
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
4. Open your browser and visit `http://localhost:5173` (or the URL shown in the terminal).

## Login Credentials (from Seed Data)
- **Admin**: 
  - Email: `admin@balaji.com`
  - Password: `123456`
- **Staff**: 
  - Email: `staff@balaji.com`
  - Password: `123456`

## Project Structure
- `backend/`: API server code
  - `models/`: Mongoose schemas
  - `controllers/`: Business logic
  - `routes/`: API endpoints
- `frontend/`: React application
  - `src/pages/`: Application views
  - `src/components/`: Reusable UI components
  - `src/context/`: State management (Auth)

## License
Proprietary software for Shri Balaji Pipes and Electricals.
