# Full-Stack Expense Tracker & Bills Management

This is a complete full-stack web application built with **React (Vite)**, **Node.js (Express)**, and **MySQL**.

## 🚀 Features

- **Dashboard**: Visual summary with Chart.js, highlighting total expenses, upcoming bills, and monthly trends.
- **Expenses Management**: Full CRUD operations. Categorize your expenses, view them in a searchable/filterable table, and keep track of your spending.
- **Bills Management**: Add your bills, see what's due soon, and mark them as paid or unpaid. Overdue bills are highlighted in red for quick attention!

## 🛠 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router, Axios, Chart.js
- **Backend**: Node.js, Express, MySQL2
- **Database**: MySQL

---

## 💻 Step-by-Step Local Setup Instructions

### 1. Database Setup

1. Make sure you have [MySQL](https://dev.mysql.com/downloads/installer/) installed and running locally.
2. Open your MySQL client (like MySQL Workbench or terminal).
3. Copy the contents of the `schema.sql` file in the root of this project and execute them in your MySQL client. 
   - This will create the database `expense_tracker`, the tables `expenses` and `bills`, and optionally insert some mock data so you can see the application working immediately.

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Update the `.env` file in the `backend` folder with your local MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=expense_tracker
   ```
4. Start the backend server:
   ```bash
   npm run start
   ```
   *Note: For development, you can install nodemon globally (`npm i -g nodemon`) and run `nodemon server.js` to automatically restart the server on changes.*

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
4. The application will be available at `http://localhost:5173`.

---

## 🧪 Testing the API with Postman

You can use Postman to test the backend endpoints directly:

**Base URL:** `http://localhost:5000/api`

### Expenses Endpoints
- **GET All Expenses**: `GET /expenses`
- **GET Single Expense**: `GET /expenses/:id`
- **CREATE Expense**: `POST /expenses`
  - Body (JSON): `{"title": "Lunch", "amount": 250, "category": "Food", "date": "2024-03-15"}`
- **UPDATE Expense**: `PUT /expenses/:id`
- **DELETE Expense**: `DELETE /expenses/:id`

### Bills Endpoints
- **GET All Bills**: `GET /bills`
- **CREATE Bill**: `POST /bills`
  - Body (JSON): `{"name": "Phone Bill", "amount": 500, "due_date": "2024-03-20"}`
- **UPDATE Bill**: `PUT /bills/:id`
- **DELETE Bill**: `DELETE /bills/:id`
- **MARK AS PAID/UNPAID**: `PATCH /bills/:id/status`
  - Body (JSON): `{"status": "paid"}`

---

## 🌐 Deployment Guide

### Deploying the Backend on Render
1. Create a free account on [Render](https://render.com/).
2. Push your project to a GitHub repository.
3. On Render, click **New +** and select **Web Service**.
4. Connect your GitHub repository and select the `backend` folder as your Root Directory.
5. Set the Build Command to `npm install` and the Start Command to `node server.js`.
6. Go to **Environment**, and add your Environment Variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`). 
   *(Note: You will need a cloud-hosted MySQL database like PlanetScale, Aiven, or TiDB for production).*
7. Click **Create Web Service**.

### Deploying the Frontend on Vercel
1. Create a free account on [Vercel](https://vercel.com/).
2. Click **Add New... -> Project** and import your GitHub repository.
3. Set the Framework Preset to **Vite** (Vercel usually detects this automatically).
4. Set the Root Directory to `frontend`.
5. In **Environment Variables**, add `VITE_API_URL` and set its value to your newly deployed Render backend URL (e.g., `https://your-backend.onrender.com/api`).
6. Click **Deploy**. Your frontend is now live!
