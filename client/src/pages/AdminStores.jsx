import React, { useEffect, useState } from "react";
import { api } from "../api";
import SortHeader from "../components/SortHeader";
import Stars from "../components/Stars";

export default function AdminStores() {
  const [list, setList] = useState([]);
  const [sort, setSort] = useState("name:asc");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [form, setForm] = useState({ name:"", email:"", address:"", ownerUserId:"" });
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/admin/stores", { params: { name, email, address, sort, pageSize: 100 } });
    setList(data.items);
  };
  useEffect(() => { load(); }, [sort]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...form, ownerUserId: form.ownerUserId || null };
      await api.post("/admin/stores", payload);
      setForm({ name:"", email:"", address:"", ownerUserId:"" });
      load();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="card">
      <h2>Stores</h2>
      <div className="row">
        <input placeholder="Filter name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Filter email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Filter address" value={address} onChange={e=>setAddress(e.target.value)} />
        <button onClick={load}>Apply</button>
      </div>

      <table>
        <thead>
          <tr>
            <SortHeader label="Name" field="name" sort={sort} setSort={setSort} />
            <SortHeader label="Email" field="email" sort={sort} setSort={setSort} />
            <th>Address</th>
            <th>Rating</th>
            <th>Count</th>
          </tr>
        </thead>
        <tbody>
          {list.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td className="muted">{s.address}</td>
              <td><Stars value={s.rating} /></td>
              <td>{s.ratingCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Add New Store</h3>
      <form onSubmit={onCreate} className="row">
        <input placeholder="Store name (20-60 chars)" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
        <input placeholder="Address (<= 400 chars)" value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} />
        <input placeholder="Owner User ID (optional)" value={form.ownerUserId} onChange={e=>setForm(f=>({...f, ownerUserId:e.target.value}))} />
        <button>Create</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
