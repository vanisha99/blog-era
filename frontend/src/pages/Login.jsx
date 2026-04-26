import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";

const ROLES = [
  { key: "user",    label: "Reader",  icon: "👤", desc: "Read & explore stories",  color: "#2a9e72" },
  { key: "blogger", label: "Blogger", icon: "✍️", desc: "Write & publish posts",    color: "#7c5cbf" },
  { key: "admin",   label: "Admin",   icon: "👑", desc: "Manage the platform",      color: "#e8622a" },
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab]       = useState("signin");
  const [role, setRole]     = useState("user");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [error, setError]   = useState("");
  const [loading, setLoad]  = useState(false);

  const redirect = (r) => {
    if (r === "admin") navigate("/admin/dashboard");
    else if (r === "blogger") navigate("/blogger/dashboard");
    else navigate("/dashboard");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoad(true);
    try {
      if (tab === "signin") {
        const s = await login(email, password, role);
        redirect(s.role);
      } else {
        if (!name.trim()) throw new Error("Name is required.");
        const s = await register(name, email, password, role);
        redirect(s.role);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoad(false);
    }
  };

  const selectedRole = ROLES.find(r => r.key === role);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left Panel */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", background: "var(--bg2)",
        borderRight: "1px solid var(--border)", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: "16px", right: "16px" }}>
          <ThemeToggle />
        </div>

        <div style={{ position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.2)",
            borderRadius: "100px", padding: "6px 14px", marginBottom: "48px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#e8622a" }} />
            <span style={{ color: "#e8622a", fontSize: "11px", letterSpacing: "0.12em", fontWeight: 500 }}>
              EST. 2026 — STORIES WORTH READING
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(36px,4vw,56px)", fontWeight: 900,
            color: "var(--text)", lineHeight: 1.1, marginBottom: "24px",
          }}>
            Where Ideas<br />Become<br />
            <em style={{ color: "#e8622a", fontStyle: "italic" }}>Stories.</em>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7, maxWidth: "340px" }}>
            BlogEra is where curious minds meet compelling narratives. Write, discover, and connect with a community that values depth over noise.
          </p>
        </div>

        <div style={{ display: "flex", gap: "40px" }}>
          {[["2.4K","Articles"],["840","Writers"],["18K","Readers"]].map(([n,l]) => (
            <div key={l}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", fontWeight: 700, color: "var(--text)" }}>{n}</div>
              <div style={{ color: "var(--muted)", fontSize: "13px", marginTop: "2px" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: "520px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px", background: "var(--bg)" }}>
        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "36px", borderBottom: "1px solid var(--border)" }}>
          {["signin","register"].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(""); }} style={{
              flex: 1, padding: "12px", background: "none", border: "none",
              borderBottom: tab === t ? "2px solid #e8622a" : "2px solid transparent",
              color: tab === t ? "var(--text)" : "var(--muted)",
              fontSize: "14px", fontWeight: tab === t ? 600 : 400,
              transition: "all 0.2s", marginBottom: "-1px",
            }}>
              {t === "signin" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "var(--text)", marginBottom: "4px" }}>
          {tab === "signin" ? "Sign in" : "Create account"}
        </h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "28px" }}>
          {tab === "signin" ? "Welcome back to BlogEra" : "Join the BlogEra community"}
        </p>

        {/* Role Selector */}
        <div style={{ marginBottom: "24px" }}>
          <div style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", marginBottom: "10px" }}>SIGN IN AS</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {ROLES.map(r => (
              <button key={r.key} onClick={() => setRole(r.key)} style={{
                flex: 1, padding: "12px 8px",
                border: `1px solid ${role === r.key ? r.color : "var(--border)"}`,
                borderRadius: "10px",
                background: role === r.key ? `${r.color}18` : "var(--surface)",
                color: role === r.key ? r.color : "var(--muted)",
                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                transition: "all 0.2s",
              }}>
                <span style={{ fontSize: "20px" }}>{r.icon}</span>
                <span style={{ fontSize: "12px", fontWeight: 500 }}>{r.label}</span>
              </button>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "12px", marginTop: "8px", textAlign: "center" }}>
            {selectedRole?.desc}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {tab === "register" && (
            <div>
              <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>NAME</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required
                style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none" }} />
            </div>
          )}
          <div>
            <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@blogera.com" required
              style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none" }} />
          </div>
          <div>
            <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPass(e.target.value)} placeholder="••••••••••" required
              style={{ width: "100%", padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none" }} />
          </div>

          {error && (
            <div style={{ background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#e8622a", fontSize: "13px" }}>
              {error}
            </div>
          )}

          {tab === "signin" && (
            <div style={{ background: "var(--surface)", borderRadius: "8px", padding: "10px 14px", border: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted)", fontSize: "11px", marginBottom: "4px" }}>DEMO CREDENTIALS</p>
              <p style={{ color: "var(--muted)", fontSize: "12px" }}>admin@blogera.com / admin123</p>
              <p style={{ color: "var(--muted)", fontSize: "12px" }}>blogger@blogera.com / blogger123</p>
              <p style={{ color: "var(--muted)", fontSize: "12px" }}>user@blogera.com / user123</p>
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px",
            background: loading ? "rgba(232,98,42,0.5)" : "#e8622a",
            border: "none", borderRadius: "10px", color: "#fff",
            fontSize: "15px", fontWeight: 600, marginTop: "4px", letterSpacing: "0.02em",
          }}>
            {loading ? "Please wait..." : (tab === "signin" ? "Sign In →" : "Create Account →")}
          </button>
        </form>
      </div>
    </div>
  );
}