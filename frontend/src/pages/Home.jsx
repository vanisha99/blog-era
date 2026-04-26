import { useState } from "react";

export default function BlogEra() {
  const [user] = useState("Sam");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#111",
      color: "#fff",
      fontFamily: "'Georgia', serif",
    }}>
      {/* Nav */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 48px",
        borderBottom: "1px solid #2a2a2a",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", fontSize: 18 }}>
          <span style={{ color: "#c9a84c" }}>✦</span> Blog Era
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 15 }}>
          <a href="#" style={{ color: "#fff", textDecoration: "none", borderBottom: "2px solid #c9a84c", paddingBottom: 2 }}>Home</a>
          <a href="#" style={{ color: "#aaa", textDecoration: "none" }}>Dashboard</a>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#c9a84c", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: "bold", fontSize: 13, color: "#111"
          }}>{user[0]}</div>
          <span style={{ color: "#aaa", fontSize: 14 }}>{user}</span>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: "100px 48px 80px",
        maxWidth: 900,
      }}>
        <h1 style={{ fontSize: "clamp(48px, 7vw, 80px)", fontWeight: "900", lineHeight: 1.05, margin: "0 0 20px" }}>
          Stories worth<br />
          <em style={{ color: "#c9a84c", fontStyle: "italic" }}>reading slowly.</em>
        </h1>
        <p style={{ fontSize: 18, color: "#bbb", marginBottom: 40, maxWidth: 480 }}>
          Essays, dispatches, and ideas from writers who take their time.
        </p>

        {/* Buttons — Start Writing removed */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <button style={{
            padding: "14px 28px",
            background: "transparent",
            border: "2px solid #fff",
            color: "#fff",
            fontFamily: "'Georgia', serif",
            fontSize: 15,
            fontWeight: "600",
            cursor: "pointer",
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            Read Stories ↓
          </button>
          <button style={{
            padding: "14px 28px",
            background: "#c9a84c",
            border: "2px solid #c9a84c",
            color: "#111",
            fontFamily: "'Georgia', serif",
            fontSize: 15,
            fontWeight: "700",
            cursor: "pointer",
            borderRadius: 4,
          }}>
            💬 Comment
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 48, marginTop: 72 }}>
          {[["3", "STORIES"], ["3", "WRITERS"], ["∞", "IDEAS"]].map(([val, label]) => (
            <div key={label}>
              <div style={{ fontSize: 28, fontWeight: "700" }}>{val}</div>
              <div style={{ fontSize: 11, color: "#888", letterSpacing: "0.12em", marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}