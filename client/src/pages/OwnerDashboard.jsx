import React, { useEffect, useState } from "react";
import { api } from "../api";
import Stars from "../components/Stars";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    api.get("/owner/dashboard").then(({data}) => setData(data));
  }, []);
  if (!data) return <div className="card">Loading...</div>;
  return (
    <div className="card">
      <h2>Owner Dashboard — {data.store.name}</h2>
      <div className="row">
        <div>Average: <Stars value={data.averageRating} /> ({data.ratingCount})</div>
      </div>
      <h3>Recent Ratings</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Rating</th>
            <th>When</th>
          </tr>
        </thead>
        <tbody>
          {data.raters.map(r => (
            <tr key={r.userId}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td className="muted">{r.address}</td>
              <td>{r.rating}</td>
              <td>{new Date(r.ratedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
