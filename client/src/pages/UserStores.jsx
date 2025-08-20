import React, { useEffect, useState } from "react";
import { api } from "../api";
import SortHeader from "../components/SortHeader";
import Stars from "../components/Stars";

export default function UserStores() {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("name:asc");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const load = async () => {
    const { data } = await api.get("/stores", { params: { name, address, sort, pageSize: 100 } });
    setList(data.items);
  };
  useEffect(() => { load(); }, [sort]);

  const submitRating = async (storeId, value) => {
    await api.post(`/stores/${storeId}/rating`, { value });
    load();
  };

  return (
    <div className="card">
      <h2>Browse Stores</h2>
      <div className="row">
        <input placeholder="Search by name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Search by address" value={address} onChange={e=>setAddress(e.target.value)} />
        <button onClick={load}>Search</button>
      </div>

      <table>
        <thead>
          <tr>
            <SortHeader label="Name" field="name" sort={sort} setSort={setSort} />
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td className="muted">{s.address}</td>
              <td><Stars value={s.overallRating} /> ({s.overallCount})</td>
              <td>{s.myRating ? <Stars value={s.myRating} /> : <span className="muted">Not rated</span>}</td>
              <td>
                <select value={s.myRating || ""} onChange={(e)=>submitRating(s.id, Number(e.target.value))}>
                  <option value="">Rate</option>
                  {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
