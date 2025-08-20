import React, { useEffect, useState } from "react";
import { api } from "../api";
import SortHeader from "../components/SortHeader";

export default function AdminUsers() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("name:asc");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [form, setForm] = useState({ name:"", email:"", address:"", password:"", role:"USER" });
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/admin/users", { params: { name, email, address, role, sort, pageSize: 50 } });
    setList(data.items); setTotal(data.total);
  };
  useEffect(() => { load(); }, [sort]);

  const onCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/admin/users", form);
      setForm({ name:"", email:"", address:"", password:"", role:"USER" });
      load();
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="card">
      <h2>Users ({total})</h2>
      <div className="row">
        <input placeholder="Filter name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Filter email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Filter address" value={address} onChange={e=>setAddress(e.target.value)} />
        <select value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">All roles</option>
          <option>ADMIN</option>
          <option>USER</option>
          <option>STORE_OWNER</option>
        </select>
        <button onClick={load}>Apply</button>
      </div>

      <table>
        <thead>
          <tr>
            <SortHeader label="Name" field="name" sort={sort} setSort={setSort} />
            <SortHeader label="Email" field="email" sort={sort} setSort={setSort} />
            <th>Address</th>
            <SortHeader label="Role" field="role" sort={sort} setSort={setSort} />
          </tr>
        </thead>
        <tbody>
          {list.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td className="muted">{u.address}</td>
              <td><span className="pill">{u.role}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{marginTop:20}}>Add New User</h3>
      <form onSubmit={onCreate} className="row">
        <input placeholder="Full name (20-60 chars)" value={form.name} onChange={e=>setForm(f=>({...f, name:e.target.value}))} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f, email:e.target.value}))} />
        <input placeholder="Address (<= 400 chars)" value={form.address} onChange={e=>setForm(f=>({...f, address:e.target.value}))} />
        <input placeholder="Password" type="password" value={form.password} onChange={e=>setForm(f=>({...f, password:e.target.value}))} />
        <select value={form.role} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
          <option>USER</option>
          <option>ADMIN</option>
          <option>STORE_OWNER</option>
        </select>
        <button>Create</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
