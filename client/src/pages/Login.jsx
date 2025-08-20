import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setError(e.response?.data?.error || e.message);
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="row">
        <input placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button>Login</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
