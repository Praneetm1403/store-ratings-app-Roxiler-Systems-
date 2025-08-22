# 🏪 Store Ratings App

A full-stack web application for managing stores, users, and ratings — built as part of a coding challenge.  
It implements **role-based access** (Admin, Store Owner, Normal User) with proper validations, dashboards, and CRUD functionality.

---

## 🚀 Tech Stack
- **Frontend:** React (Vite), Context API, TailwindCSS  
- **Backend:** Node.js, Express.js, Prisma ORM  
- **Database:** PostgreSQL  
- **Auth:** JWT-based authentication  

---

## 🔑 Roles & Features

### 👨‍💼 Admin
- Login with credentials  
- Create **Users** (Admin, Store Owner, Normal User)  
- Create **Stores**  
- Dashboard with **total counts** of users, stores, and ratings  
- List, filter, and sort users/stores  

### 🙍 Normal User
- Signup & login  
- Browse stores with search & sorting  
- Submit or update rating (1–5 stars) per store  
- View average ratings for each store  

### 🏪 Store Owner
- Login with credentials  
- View **average rating** of their store  
- See **who rated** their store with details (email, address, rating, timestamp)  

---

## 🛠 Setup Instructions

### Backend
```bash
cd server
cp .env.example .env   # Update DATABASE_URL & JWT_SECRET
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev

### Frontend
```bash
cd client
npm install
npm run dev


Default frontend runs on http://localhost:5173
Backend runs on http://localhost:4000
