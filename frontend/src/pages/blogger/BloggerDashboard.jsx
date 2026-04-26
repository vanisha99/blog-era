import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../../context/PostsContext";
import ThemeToggle from "../../components/ThemeToggle";

const CATEGORIES = ["Technology","Lifestyle","Travel","Health","Business","Culture","Science"];

export default function BloggerDashboard() {
  const { user, logout } = useAuth();
  const { posts, addPost } = usePosts();
  const [view, setView]   = useState("posts");
  const [form, setForm]   = useState({ title: "", content: "", category: "Technology", tags: "", image: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const myPosts = posts.filter(p => p.authorId === user?.id || p.author === user?.name);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.content.trim()) { setError("Title and content are required."); return; }
    addPost({
      title: form.title, content: form.content, category: form.category,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      image: form.image || `https://picsum.photos/seed/${Date.now()}/800/450`,
      author: user?.name, authorId: user?.id,
    });
    setForm({ title: "", content: "", category: "Technology", tags: "", image: "" });
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); setView("posts"); }, 2000);
  };

  const inputStyle = {
    width: "100%", padding: "12px 14px", background: "var(--surface)",
    border: "1px solid var(--border)", borderRadius: "10px",
    color: "var(--text)", fontSize: "14px", outline: "none",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "var(--text)", fontWeight: 700 }}>BlogEra</span>
          <span style={{ background: "rgba(124,92,191,0.15)", color: "#7c5cbf", fontSize: "11px", padding: "3px 10px", borderRadius: "100px", fontWeight: 500 }}>BLOGGER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => setView("posts")} style={{
            background: view === "posts" ? "var(--surface2)" : "none",
            border: "1px solid var(--border)", borderRadius: "8px",
            color: "var(--text)", padding: "6px 14px", fontSize: "13px",
          }}>My Posts</button>
          <button onClick={() => setView("write")} style={{
            background: "#7c5cbf", border: "none", borderRadius: "8px",
            color: "#fff", padding: "6px 14px", fontSize: "13px", fontWeight: 500,
          }}>+ Write</button>
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>✍️ {user?.name}</span>
          <ThemeToggle />
          <button onClick={logout} style={{ background: "rgba(124,92,191,0.1)", border: "1px solid rgba(124,92,191,0.2)", borderRadius: "8px", color: "#7c5cbf", padding: "6px 14px", fontSize: "13px" }}>Sign Out</button>
        </div>
      </header>

      <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
        {view === "posts" ? (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "var(--text)", marginBottom: "8px" }}>My Posts</h2>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "28px" }}>
              {myPosts.length} posts — {myPosts.filter(p => p.published).length} published
            </p>
            {myPosts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>✍️</div>
                <p style={{ color: "var(--muted)" }}>No posts yet. Write your first story!</p>
                <button onClick={() => setView("write")} style={{ marginTop: "16px", background: "#7c5cbf", border: "none", borderRadius: "10px", color: "#fff", padding: "10px 20px", fontSize: "14px" }}>Start Writing</button>
              </div>
            ) : myPosts.map(post => (
              <div key={post.id} style={{
                background: "var(--surface)", borderRadius: "14px", padding: "20px",
                border: "1px solid var(--border)", marginBottom: "14px",
                display: "flex", gap: "16px", alignItems: "center",
              }}>
                <img src={post.image} alt="" style={{ width: "88px", height: "60px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "var(--text)", fontWeight: 500, marginBottom: "6px" }}>{post.title}</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <span style={{ color: "var(--muted)", fontSize: "12px" }}>{post.category}</span>
                    <span style={{ color: "var(--muted)", fontSize: "12px" }}>❤️ {post.likes}</span>
                    <span style={{ color: "var(--muted)", fontSize: "12px" }}>💬 {post.comments.length}</span>
                    <span style={{
                      padding: "3px 9px", borderRadius: "100px", fontSize: "11px",
                      background: post.published ? "rgba(42,158,114,0.15)" : "rgba(240,165,0,0.15)",
                      color: post.published ? "#2a9e72" : "#f0a500",
                    }}>{post.published ? "Published" : "Pending Review"}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "var(--text)", marginBottom: "8px" }}>Write a Story</h2>
            <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "28px" }}>Your post will be reviewed by admin before publishing.</p>

            {submitted && (
              <div style={{ background: "rgba(42,158,114,0.1)", border: "1px solid rgba(42,158,114,0.3)", borderRadius: "10px", padding: "14px 18px", color: "#2a9e72", marginBottom: "20px" }}>
                ✅ Post submitted! Awaiting admin review.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {[
                { label: "TITLE", key: "title", placeholder: "Your story title..." },
                { label: "IMAGE URL (optional)", key: "image", placeholder: "https://..." },
                { label: "TAGS (comma separated)", key: "tags", placeholder: "AI, Tech, Future" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}

              <div>
                <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>CATEGORY</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ color: "var(--muted)", fontSize: "11px", letterSpacing: "0.1em", display: "block", marginBottom: "6px" }}>CONTENT</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  placeholder="Tell your story..." rows={10}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
              </div>

              {error && (
                <div style={{ background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.3)", borderRadius: "8px", padding: "10px 14px", color: "#e8622a", fontSize: "13px" }}>{error}</div>
              )}

              <div style={{ display: "flex", gap: "12px" }}>
                <button type="button" onClick={() => setView("posts")} style={{
                  flex: 1, padding: "13px", background: "var(--surface)",
                  border: "1px solid var(--border)", borderRadius: "10px", color: "var(--muted)", fontSize: "14px",
                }}>Cancel</button>
                <button type="submit" style={{
                  flex: 2, padding: "13px", background: "#7c5cbf",
                  border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 600,
                }}>Submit for Review →</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}