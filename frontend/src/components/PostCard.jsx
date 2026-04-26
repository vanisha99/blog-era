import { useNavigate } from "react-router-dom";

export default function PostCard({ post, actions, delay = 0 }) {
  const navigate = useNavigate();

  return (
    <div style={{ ...styles.card, animationDelay: `${delay}ms` }} className="fade-up">
      <div style={{ ...styles.cover, background: post.coverColor }}>
        <span style={styles.category}>{post.category}</span>
      </div>
      <div style={styles.body}>
        <div style={styles.meta}>
          <span style={styles.author}>{post.author}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.date}>{post.date}</span>
          <span style={styles.dot}>·</span>
          <span style={styles.readTime}>{post.readTime}</span>
        </div>
        <h3 style={styles.title} onClick={() => navigate(`/post/${post.id}`)}>
          {post.title}
        </h3>
        <p style={styles.excerpt}>{post.excerpt}</p>
        <div style={styles.footer}>
          <span style={styles.stat}>💬 {post.comments?.length || 0}</span>
          {actions && <div style={styles.actions}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff", borderRadius: "var(--radius-lg)", overflow: "hidden",
    border: "1px solid var(--border)", boxShadow: "var(--card-shadow)",
    display: "flex", flexDirection: "column", opacity: 0,
  },
  cover: { height: 110, display: "flex", alignItems: "flex-end", padding: "0.75rem 1rem" },
  category: {
    fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.12em",
    textTransform: "uppercase", color: "rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.1)", padding: "0.2rem 0.6rem",
    borderRadius: "2rem", backdropFilter: "blur(4px)",
  },
  body: { padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.6rem", flex: 1 },
  meta: { display: "flex", alignItems: "center", gap: "0.4rem", flexWrap: "wrap" },
  author: { fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600, color: "var(--gold)" },
  dot: { color: "var(--border)", fontSize: "0.75rem" },
  date: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" },
  readTime: { fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--muted)" },
  title: {
    fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700,
    color: "var(--ink)", lineHeight: 1.35, cursor: "pointer",
  },
  excerpt: {
    fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--muted)",
    lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1,
  },
  footer: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    marginTop: "0.5rem", paddingTop: "0.75rem", borderTop: "1px solid var(--paper-dark)",
  },
  stat: { fontSize: "0.75rem", color: "var(--muted)" },
  actions: { display: "flex", gap: "0.5rem" },
};