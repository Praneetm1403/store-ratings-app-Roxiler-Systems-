# 🏪 Store Ratings App

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A full-stack web application for managing stores, users, and ratings — built as part of a coding challenge. It implements **role-based access control** (Admin, Store Owner, Normal User) with proper validations, dashboards, and CRUD functionality.

---

## ✨ Key Features

- **🔐 Role-Based Access Control:** Distinct dashboards and permissions for Admins, Store Owners, and Users
- **🔑 JWT Authentication:** Secure, token-based authentication for all roles
- **📊 Full CRUD Functionality:** Create, Read, Update, and Delete operations for users, stores, and ratings
- **💻 Interactive Frontend:** Responsive UI built with React and TailwindCSS
- **🚀 Robust Backend:** API built with Node.js, Express, and Prisma ORM
- **📱 Mobile Responsive:** Optimized for all device sizes

---

## 🛠️ Tech Stack

| Category      | Technology                                    |
| ------------- | --------------------------------------------- |
| **Frontend**  | React (Vite), Context API, TailwindCSS        |
| **Backend**   | Node.js, Express.js                           |
| **ORM**       | Prisma                                        |
| **Database**  | PostgreSQL                                    |
| **Auth**      | JSON Web Tokens (JWT)                         |
| **Styling**   | TailwindCSS                                   |

---

## 🔑 Roles & Permissions

### 👨‍💼 Admin
- **Login:** Access with admin credentials
- **Dashboard:** View total counts of users, stores, and ratings
- **User Management:** Create, list, filter, and sort all users (Admins, Store Owners, Normal Users)
- **Store Management:** Create, list, filter, and sort all stores
- **Full Control:** Complete CRUD operations across the platform

### 🏪 Store Owner
- **Login:** Access with store owner credentials
- **Dashboard:** View the average rating of their assigned store
- **Rating Analytics:** See detailed ratings breakdown and trends
- **Customer Insights:** View all ratings for their store with user details (email, address), ratings, and timestamps
- **Store Management:** Update their store information

### 👤 Normal User
- **Signup/Login:** Create new account or login to existing account
- **Store Discovery:** Browse all stores with search and sorting functionality
- **Rating System:** View average ratings for each store
- **Submit Ratings:** Rate stores on a 1–5 star scale
- **Update Ratings:** Modify their existing ratings for stores
- **Profile Management:** Update personal information

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- PostgreSQL database instance

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/store-ratings-app.git
cd store-ratings-app
```

### 2️⃣ Backend Setup
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
JWT_SECRET="your_super_secret_jwt_key_here"
PORT=4000
NODE_ENV=development
```

```bash
# Generate Prisma client
npm run prisma:generate

# Apply database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run seed

# Start the backend server
npm run dev
```
✅ Backend will run on `http://localhost:4000`

### 3️⃣ Frontend Setup
```bash
# Navigate to the client directory (from root)
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

---

## 🧪 Demo Accounts

These accounts are pre-loaded for testing:

| Role         | Email                | Password    | Access Level               |
| ------------ | -------------------- | ----------- | -------------------------- |
| **Admin**    | admin@example.com    | Admin@123   | Full system access         |
| **Owner**    | owner@example.com    | Owner@123   | Store management           |
| **User**     | user@example.com     | User@1234   | Browse & rate stores       |

---


---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/auth/change-password` - Change password (authenticated)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (users, stores, ratings)
- `GET /api/admin/users` - List users (filters, sorting, pagination)
- `GET /api/admin/users/:id` - Get user details (with store info if owner)
- `POST /api/admin/users` - Create user (Admin, Store Owner, User)
- `GET /api/admin/stores` - List stores (filters, sorting, pagination)
- `POST /api/admin/stores` - Create store

### Store Owner
- `GET /api/owner/dashboard` - Get store analytics, average rating, raters

### Stores (User)
- `GET /api/stores` - List all stores (with ratings, search, sorting, pagination)
- `POST /api/stores/:storeId/rating` - Submit or update rating for a store (authenticated)

---

## ✅ Form Validations

- **Name:** 20–60 characters, letters and spaces only
- **Email:** Valid email format, unique in system
- **Password:** 8–16 characters, must include:
  - At least 1 uppercase letter
  - At least 1 special character
- **Address:** Maximum 400 characters
- **Rating:** Integer between 1–5 stars
- **Store Name:** 3–100 characters, unique

---

## 🧪 Available Scripts

### Backend (server/)
```bash
npm run dev          # Start development server
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run seed         # Seed database with sample data
npm run prisma:studio    # Open Prisma Studio
```

### Frontend (client/)
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

---

## 🎨 Screenshots

### Admin Dashboard
![Admin Dashboard](./screenshots/admin-dashboard.png)
*Comprehensive overview of users, stores, and ratings with management controls*

### User Store View
![Store Listings](./screenshots/user-stores.png)
*Browse and search stores with ratings and filtering options*

### Store Owner Dashboard
![Owner Dashboard](./screenshots/owner-dashboard.png)
*Detailed analytics and customer feedback for store owners*

---

## 🔜 Future Enhancements

- [ ] **Deployment:** Deploy on Render/Netlify with production database
- [ ] **Docker Support:** Containerized development and deployment
- [ ] **Password Recovery:** Forgot password flow with email verification
- [ ] **Testing:** Unit and integration test coverage
- [ ] **Real-time Updates:** WebSocket integration for live notifications
- [ ] **Advanced Analytics:** Charts and graphs for rating trends
- [ ] **Image Uploads:** Store photos and user avatars
- [ ] **Email Notifications:** Rating alerts for store owners
- [ ] **Mobile App:** React Native companion app
- [ ] **API Documentation:** Swagger/OpenAPI documentation

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Praneet Mahendrakar**

- GitHub: [@your-github-username](https://github.com/your-github-username)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/your-profile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Built as part of a coding challenge
- Thanks to the React and Node.js communities
- Inspired by modern e-commerce rating systems

---

⭐ **Star this repository if you found it helpful!** ⭐
