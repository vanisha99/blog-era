import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const res = register(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (res.success) {
      const path = res.role === "admin" ? "/admin" : res.role === "blogger" ? "/blogger" : "/dashboard";
      navigate(path);
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-branding fade-in">
          <Link to="/" className="auth-logo">✦ Blog Era</Link>
          <blockquote className="auth-quote">
            "A word after a word after a word is power."
            <cite>— Margaret Atwood</cite>
          </blockquote>
        </div>
        <div className="auth-roles-info fade-up">
          <p className="demo-label">Choose your role</p>
          <div className="role-info-card" style={{ "--role-color": "#82b574" }}>
            <span className="ri-role" style={{ color: "#82b574" }}>Reader</span>
            <span className="ri-desc">Browse and discover stories. Like and engage with content.</span>
          </div>
          <div className="role-info-card" style={{ "--role-color": "#c9933a" }}>
            <span className="ri-role" style={{ color: "#c9933a" }}>Blogger</span>
            <span className="ri-desc">Write and publish stories. Build your audience.</span>
          </div>
          <div className="role-info-card" style={{ "--role-color": "#e8724a" }}>
            <span className="ri-role" style={{ color: "#e8724a" }}>Admin</span>
            <span className="ri-desc">Manage the platform, users, and all published content.</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card fade-up">
          <div className="auth-header">
            <h1>Create account</h1>
            <p>Join Blog Era and start your journey</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="Your full name"
                value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input type="password" name="password" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-field">
              <label>I want to join as</label>
              <div className="role-selector">
                {["user", "blogger", "admin"].map(r => (
                  <button type="button" key={r}
                    className={`role-option ${form.role === r ? "selected" : ""}`}
                    onClick={() => setForm(f => ({ ...f, role: r }))}>
                    <span className="role-icon">
                      {r === "user" ? "◎" : r === "blogger" ? "✍" : "⚙"}
                    </span>
                    <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}