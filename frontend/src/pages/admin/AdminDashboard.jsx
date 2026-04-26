import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../../context/PostsContext";
import ThemeToggle from "../../components/ThemeToggle";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { posts, deletePost, publishPost, unpublishPost } = usePosts();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = posts
    .filter(p => filter === "all" ? true : filter === "published" ? p.published : !p.published)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const stats = [
    { label: "Total Posts",    value: posts.length,                           color: "#e8622a" },
    { label: "Published",      value: posts.filter(p => p.published).length,  color: "#2a9e72" },
    { label: "Pending Review", value: posts.filter(p => !p.published).length, color: "#f0a500" },
    { label: "Total Comments", value: posts.reduce((a,p) => a + p.comments.length, 0), color: "#7c5cbf" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "var(--bg2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "var(--text)", fontWeight: 700 }}>BlogEra</span>
          <span style={{ background: "rgba(232,98,42,0.15)", color: "#e8622a", fontSize: "11px", padding: "3px 10px", borderRadius: "100px", fontWeight: 500 }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>👑 {user?.name}</span>
          <ThemeToggle />
          <button onClick={logout} style={{ background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.2)", borderRadius: "8px", color: "#e8622a", padding: "6px 14px", fontSize: "13px" }}>Sign Out</button>
        </div>
      </header>

      <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "40px" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "var(--surface)", borderRadius: "14px", padding: "24px", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ color: "var(--muted)", fontSize: "13px", marginTop: "4px" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {["all","published","pending"].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "7px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 500,
                background: filter === f ? "#e8622a" : "var(--surface)",
                border: filter === f ? "none" : "1px solid var(--border)",
                color: filter === f ? "#fff" : "var(--muted)",
              }}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search posts..."
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", color: "var(--text)", fontSize: "13px", outline: "none", width: "220px" }} />
        </div>

        {/* Posts */}
        <div style={{ background: "var(--surface)", borderRadius: "16px", border: "1px solid var(--border)", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center", color: "var(--muted)" }}>No posts found.</div>
          ) : filtered.map((post, i) => (
            <div key={post.id} style={{
              padding: "20px 24px", display: "flex", alignItems: "center", gap: "16px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <img src={post.image} alt="" style={{ width: "72px", height: "48px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: "var(--text)", fontWeight: 500, fontSize: "14px", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{post.title}</div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <span style={{ color: "var(--muted)", fontSize: "12px" }}>by {post.author}</span>
                  <span style={{ color: "var(--muted)", fontSize: "12px" }}>💬 {post.comments.length}</span>
                  <span style={{ color: "var(--muted)", fontSize: "12px" }}>❤️ {post.likes}</span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <span style={{
                  padding: "4px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 500,
                  background: post.published ? "rgba(42,158,114,0.15)" : "rgba(240,165,0,0.15)",
                  color: post.published ? "#2a9e72" : "#f0a500",
                }}>{post.published ? "Published" : "Pending"}</span>
                {!post.published
                  ? <button onClick={() => publishPost(post.id)} style={{ padding: "6px 12px", background: "rgba(42,158,114,0.1)", border: "1px solid rgba(42,158,114,0.3)", borderRadius: "7px", color: "#2a9e72", fontSize: "12px" }}>Publish</button>
                  : <button onClick={() => unpublishPost(post.id)} style={{ padding: "6px 12px", background: "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.3)", borderRadius: "7px", color: "#f0a500", fontSize: "12px" }}>Unpublish</button>
                }
                <button onClick={() => { if (window.confirm("Delete this post?")) deletePost(post.id); }}
                  style={{ padding: "6px 12px", background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.3)", borderRadius: "7px", color: "#e8622a", fontSize: "12px" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}