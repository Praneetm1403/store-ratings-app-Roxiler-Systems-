import React from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import AuthProvider, { useAuth } from "./auth.jsx";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminStores from "./pages/AdminStores";
import UserStores from "./pages/UserStores";
import OwnerDashboard from "./pages/OwnerDashboard";

function Nav() {
  const { user, logout } = useAuth();
  return (
    <header>
      <div><Link to="/">⭐ Store Ratings</Link></div>
      <nav>
        {user?.role === "ADMIN" && (<>
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users</Link>
          <Link to="/admin/stores">Stores</Link>
        </>)}
        {user?.role === "USER" && (<Link to="/stores">Stores</Link>)}
        {user?.role === "STORE_OWNER" && (<Link to="/owner">Owner</Link>)}
        {!user ? (<>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </>) : (<button onClick={logout}>Logout</button>)}
      </nav>
    </header>
  );
}

function Protected({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Nav />
      <div className="container">
        <Routes>
          <Route path="/" element={<div className="card">Welcome! Please login or signup.</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/stores" element={<Protected roles={["USER"]}><UserStores /></Protected>} />
          <Route path="/admin" element={<Protected roles={["ADMIN"]}><AdminDashboard /></Protected>} />
          <Route path="/admin/users" element={<Protected roles={["ADMIN"]}><AdminUsers /></Protected>} />
          <Route path="/admin/stores" element={<Protected roles={["ADMIN"]}><AdminStores /></Protected>} />
          <Route path="/owner" element={<Protected roles={["STORE_OWNER"]}><OwnerDashboard /></Protected>} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
