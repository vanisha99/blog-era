import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../context/PostsContext";

export default function PostDetail() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { posts, addComment } = usePosts();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);

  const post = posts.find((p) => p.id === parseInt(id));

  if (!post) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", color: "var(--muted)" }}>Post not found</h2>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>← Go Back</button>
    </div>
  );

  const handleComment = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    addComment(post.id, { user: currentUser.name, userId: currentUser.id, text: text.trim() });
    setText("");
    setDone(true);
    setTimeout(() => setDone(false), 2500);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>

        <article style={styles.article} className="fade-up">
          <div style={{ ...styles.cover, background: post.coverColor }}>
            <span style={styles.category}>{post.category}</span>
            <h1 style={styles.title}>{post.title}</h1>
            <div style={styles.meta}>
              <span style={styles.metaAuthor}>{post.author}</span>
              <span style={styles.metaDot}>·</span>
              <span style={styles.metaItem}>{post.date}</span>
              <span style={styles.metaDot}>·</span>
              <span style={styles.metaItem}>{post.readTime} read</span>
              <span style={styles.metaDot}>·</span>
              <span style={styles.metaItem}>{post.comments?.length || 0} comments</span>
            </div>
          </div>
          <div style={styles.body}>
            {post.excerpt && <p style={styles.excerpt}>{post.excerpt}</p>}
            <div style={styles.divider} />
            {post.content.split('\n\n').map((para, i) => (
              <p key={i} style={styles.para}>{para}</p>
            ))}
          </div>
        </article>

        <section style={styles.comments}>
          <h2 style={styles.commentsTitle}>
            Comments <span style={styles.commentsCount}>{post.comments?.length || 0}</span>
          </h2>

          {currentUser.role === "user" && (
            <div style={styles.commentForm}>
              <p style={styles.commentingAs}>Commenting as {currentUser.name}</p>
              <form onSubmit={handleComment}>
                <textarea value={text} onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts..." style={styles.commentInput} rows={4} />
                <div style={styles.commentFooter}>
                  {done && <span style={styles.successMsg}>✓ Comment posted!</span>}
                  <button type="submit" disabled={!text.trim()}
                    style={{ ...styles.postBtn, ...(!text.trim() ? { opacity: 0.4, cursor: "not-allowed" } : {}) }}>
                    Post Comment
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentUser.role !== "user" && (
            <div style={styles.noteBox}>💡 Comments are available for reader accounts only.</div>
          )}

          <div style={styles.commentsList}>
            {!post.comments?.length ? (
              <p style={styles.noComments}>No comments yet.</p>
            ) : (
              post.comments.map((c, i) => (
                <div key={c.id} style={{ ...styles.commentCard, animationDelay: `${i * 60}ms` }} className="fade-up">
                  <div style={styles.commentHeader}>
                    <div style={styles.commentAvatar}>{c.user.split(" ").map(n => n[0]).join("")}</div>
                    <div>
                      <div style={styles.commentUser}>{c.user}</div>
                      <div style={styles.commentDate}>{c.date}</div>
                    </div>
                  </div>
                  <p style={styles.commentText}>{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "var(--cream)", padding: "2rem 0 5rem" },
  container: { maxWidth: 780, margin: "0 auto", padding: "0 2rem" },
  backBtn: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "0.4rem 0.9rem", cursor: "pointer", marginBottom: "1.5rem", display: "inline-block" },
  article: { background: "#fff", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)", marginBottom: "2.5rem", opacity: 0 },
  cover: { padding: "3.5rem 3rem 2.5rem", position: "relative" },
  category: { fontFamily: "var(--font-mono)", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", background: "rgba(255,255,255,0.1)", padding: "0.25rem 0.7rem", borderRadius: "2rem", display: "inline-block", marginBottom: "1rem" },
  title: { fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "#fff", lineHeight: 1.15, letterSpacing: "-1px", marginBottom: "1.5rem" },
  meta: { display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" },
  metaAuthor: { fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--gold)" },
  metaDot: { color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" },
  metaItem: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" },
  body: { padding: "2.5rem 3rem" },
  excerpt: { fontFamily: "var(--font-display)", fontSize: "1.15rem", fontStyle: "italic", color: "var(--muted)", lineHeight: 1.7, marginBottom: "1.5rem" },
  divider: { height: 1, background: "var(--paper-dark)", marginBottom: "1.75rem" },
  para: { fontFamily: "var(--font-body)", fontSize: "1.05rem", lineHeight: 1.85, color: "#2a2a2a", marginBottom: "1.4rem" },
  comments: { background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", padding: "2rem 2.5rem", boxShadow: "var(--card-shadow)" },
  commentsTitle: { fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, color: "var(--ink)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" },
  commentsCount: { fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "#fff", background: "var(--ink)", padding: "0.1rem 0.5rem", borderRadius: "2rem" },
  commentForm: { background: "var(--cream)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "1.25rem", marginBottom: "1.75rem" },
  commentingAs: { fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)", marginBottom: "0.75rem" },
  commentInput: { fontFamily: "var(--font-body)", fontSize: "0.9rem", lineHeight: 1.65, color: "var(--ink)", background: "#fff", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", padding: "0.85rem 1rem", outline: "none", resize: "none", width: "100%" },
  commentFooter: { display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "1rem", marginTop: "0.75rem" },
  successMsg: { fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#1e4d2b" },
  postBtn: { fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "#fff", background: "var(--ink)", border: "none", borderRadius: "var(--radius)", padding: "0.55rem 1.25rem", cursor: "pointer" },
  noteBox: { fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--muted)", background: "var(--paper)", border: "1px dashed var(--border)", borderRadius: "var(--radius)", padding: "0.85rem 1rem", marginBottom: "1.5rem" },
  commentsList: { display: "flex", flexDirection: "column", gap: "1rem" },
  noComments: { fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--muted)", textAlign: "center", padding: "2rem" },
  commentCard: { border: "1px solid var(--paper-dark)", borderRadius: "var(--radius)", padding: "1rem 1.25rem", opacity: 0 },
  commentHeader: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.6rem" },
  commentAvatar: { width: 28, height: 28, borderRadius: "50%", background: "var(--slate)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", fontWeight: 700, fontFamily: "var(--font-mono)", flexShrink: 0 },
  commentUser: { fontFamily: "var(--font-body)", fontSize: "0.8rem", fontWeight: 600, color: "var(--ink)" },
  commentDate: { fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)" },
  commentText: { fontFamily: "var(--font-body)", fontSize: "0.875rem", lineHeight: 1.65, color: "#3a3a3a" },
};