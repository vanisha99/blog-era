import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePosts } from "../../context/PostsContext";
import ThemeToggle from "../../components/ThemeToggle";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { posts, likePost, addComment } = usePosts();
  const [selected, setSelected] = useState(null);
  const [comment, setComment]   = useState("");
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("All");

  const published  = posts.filter(p => p.published);
  const categories = ["All", ...new Set(published.map(p => p.category))];
  const filtered   = published
    .filter(p => category === "All" || p.category === category)
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const openPost = posts.find(p => p.id === selected);

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    addComment(selected, { author: user?.name, avatar: user?.name?.slice(0,2).toUpperCase(), text: comment });
    setComment("");
  };

  if (openPost) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)",
      }}>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Back to Feed
        </button>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>👤 {user?.name}</span>
          <ThemeToggle />
          <button onClick={logout} style={{ background: "rgba(42,158,114,0.1)", border: "1px solid rgba(42,158,114,0.2)", borderRadius: "8px", color: "#2a9e72", padding: "6px 14px", fontSize: "13px" }}>Sign Out</button>
        </div>
      </header>

      <div style={{ maxWidth: "740px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          <span style={{ background: "rgba(42,158,114,0.15)", color: "#2a9e72", padding: "4px 10px", borderRadius: "100px", fontSize: "12px" }}>{openPost.category}</span>
          {openPost.tags?.map(t => (
            <span key={t} style={{ background: "var(--surface)", color: "var(--muted)", padding: "4px 10px", borderRadius: "100px", fontSize: "12px", border: "1px solid var(--border)" }}>#{t}</span>
          ))}
        </div>

        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "36px", color: "var(--text)", fontWeight: 700, lineHeight: 1.2, marginBottom: "16px" }}>{openPost.title}</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#7c5cbf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "#fff", fontWeight: 600 }}>
            {openPost.author?.slice(0,2).toUpperCase()}
          </div>
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>{openPost.author}</span>
          <span style={{ color: "var(--faint)", fontSize: "13px" }}>·</span>
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>{new Date(openPost.createdAt).toLocaleDateString()}</span>
        </div>

        <img src={openPost.image} alt="" style={{ width: "100%", borderRadius: "14px", marginBottom: "32px", objectFit: "cover", maxHeight: "360px" }} />
        <p style={{ color: "var(--muted)", fontSize: "17px", lineHeight: 1.85, marginBottom: "40px" }}>{openPost.content}</p>

        <button onClick={() => likePost(openPost.id)} style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "rgba(232,98,42,0.1)", border: "1px solid rgba(232,98,42,0.2)",
          borderRadius: "100px", padding: "8px 18px", color: "#e8622a", fontSize: "14px", marginBottom: "40px",
        }}>❤️ {openPost.likes} Likes</button>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px" }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "20px", color: "var(--text)", marginBottom: "20px" }}>
            Comments ({openPost.comments.length})
          </h3>
          {openPost.comments.map(c => (
            <div key={c.id} style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--muted)", flexShrink: 0 }}>
                {c.avatar}
              </div>
              <div style={{ background: "var(--surface)", borderRadius: "10px", padding: "12px 14px", flex: 1, border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ color: "var(--text)", fontSize: "13px", fontWeight: 500 }}>{c.author}</span>
                  <span style={{ color: "var(--muted)", fontSize: "12px" }}>{c.time}</span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6 }}>{c.text}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a comment..."
              style={{ flex: 1, padding: "10px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text)", fontSize: "14px", outline: "none" }} />
            <button type="submit" style={{ padding: "10px 18px", background: "#2a9e72", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: 500 }}>Post</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{
        borderBottom: "1px solid var(--border)", padding: "0 40px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "var(--text)", fontWeight: 700 }}>BlogEra</span>
          <span style={{ background: "rgba(42,158,114,0.15)", color: "#2a9e72", fontSize: "11px", padding: "3px 10px", borderRadius: "100px", fontWeight: 500 }}>READER</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stories..."
            style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "8px", padding: "7px 14px", color: "var(--text)", fontSize: "13px", outline: "none", width: "200px" }} />
          <span style={{ color: "var(--muted)", fontSize: "14px" }}>👤 {user?.name}</span>
          <ThemeToggle />
          <button onClick={logout} style={{ background: "rgba(42,158,114,0.1)", border: "1px solid rgba(42,158,114,0.2)", borderRadius: "8px", color: "#2a9e72", padding: "6px 14px", fontSize: "13px" }}>Sign Out</button>
        </div>
      </header>

      <div style={{ padding: "40px", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", color: "var(--text)", marginBottom: "8px" }}>Stories Worth Reading</h2>
        <p style={{ color: "var(--muted)", fontSize: "14px", marginBottom: "28px" }}>{filtered.length} stories for you</p>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
          {categories.map(c => (
            <button key={c} onClick={() => setCategory(c)} style={{
              padding: "6px 14px", borderRadius: "100px", fontSize: "13px",
              background: category === c ? "#2a9e72" : "var(--surface)",
              border: category === c ? "none" : "1px solid var(--border)",
              color: category === c ? "#fff" : "var(--muted)",
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: "20px" }}>
          {filtered.map(post => (
            <div key={post.id} onClick={() => setSelected(post.id)}
              style={{ background: "var(--surface)", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)", cursor: "pointer", transition: "transform 0.2s, border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "rgba(42,158,114,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              <img src={post.image} alt="" style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              <div style={{ padding: "18px" }}>
                <span style={{ background: "rgba(42,158,114,0.15)", color: "#2a9e72", padding: "3px 8px", borderRadius: "100px", fontSize: "11px", display: "inline-block", marginBottom: "10px" }}>{post.category}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "17px", color: "var(--text)", marginBottom: "8px", lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.6, marginBottom: "14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.content}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--faint)", fontSize: "12px" }}>{post.author}</span>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <span style={{ color: "var(--faint)", fontSize: "12px" }}>❤️ {post.likes}</span>
                    <span style={{ color: "var(--faint)", fontSize: "12px" }}>💬 {post.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)" }}>No stories found.</div>
        )}
      </div>
    </div>
  );
}