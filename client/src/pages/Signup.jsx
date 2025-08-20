import React, { useState } from "react";
import { api } from "../api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [ok, setOk] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(""); setOk(false);
    try {
      await api.post("/auth/signup", { name, email, address, password });
      setOk(true);
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="card">
      <h2>Signup</h2>
      <form onSubmit={onSubmit} className="row">
        <input placeholder="Full Name (20-60 chars)" value={name} onChange={(e)=>setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Address (<= 400 chars)" value={address} onChange={(e)=>setAddress(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button>Sign up</button>
      </form>
      {ok && <div>Signup successful. You may login now.</div>}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
