import React, { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get("/admin/dashboard").then(({data}) => setStats(data));
  }, []);

  if (!stats) return <div className="card">Loading...</div>;
  return (
    <div className="card">
      <h2>Admin Dashboard</h2>
      <div className="row">
        <div className="pill">Users: {stats.totalUsers}</div>
        <div className="pill">Stores: {stats.totalStores}</div>
        <div className="pill">Ratings: {stats.totalRatings}</div>
      </div>
    </div>
  );
}
