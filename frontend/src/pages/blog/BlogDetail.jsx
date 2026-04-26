import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BlogDetail() {
  const { id } = useParams();
  const { blogs, user, likeBlog, deleteBlog, addComment } = useAuth();
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState("");
  const [submitted, setSubmitted]     = useState(false);

  const blog = blogs.find(b => b.id === parseInt(id));

  if (!blog) return (
    <div style={{ textAlign:"center", paddingTop:80, fontFamily:"'Georgia',serif", color:"#e8e0d0", background:"#0d0d0d", minHeight:"100vh" }}>
      <h2>Story not found.</h2>
      <Link to={user?.role==="admin" ? "/admin" : user?.role==="blogger" ? "/blogger" : "/dashboard"} style={{ color:"#c9a96e" }}>← Back</Link>
    </div>
  );

  const canDelete = user?.role === "admin" || user?.id === blog.authorId;
  const backPath  = user?.role === "admin" ? "/admin" : user?.role === "blogger" ? "/blogger" : "/dashboard";

  const handleDelete = () => { deleteBlog(blog.id); navigate(backPath); };

  const handleComment = () => {
    if (!commentText.trim()) return;
    addComment(blog.id, commentText);
    setCommentText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div style={S.page}>
      <div style={S.container}>
        <Link to={backPath} style={S.back}>← All Stories</Link>
        <article>
          <div style={S.meta}>
            <span style={S.cat}>{blog.category}</span>
            <span style={S.metaText}>{blog.date}</span>
            <span style={S.metaText}>{blog.readTime} read</span>
          </div>
          <h1 style={S.title}>{blog.title}</h1>
          <p style={S.excerpt}>{blog.excerpt}</p>
          <div style={S.author}>
            <div style={S.av}>{blog.author[0]}</div>
            <div>
              <div style={S.authorName}>{blog.author}</div>
              <div style={S.authorRole}>Writer</div>
            </div>
          </div>
          <div style={S.divider} />
          <div style={S.body}>
            {blog.content.split("\n\n").map((p, i) => <p key={i} style={S.para}>{p}</p>)}
          </div>
          {blog.tags?.length > 0 && (
            <div style={S.tags}>
              {blog.tags.map(t => <span key={t} style={S.tag}>#{t}</span>)}
            </div>
          )}
          <div style={S.actions}>
            <button style={S.likeBtn} onClick={() => likeBlog(blog.id)}>♥ Like {blog.likes}</button>
            {canDelete && <button style={S.deleteBtn} onClick={handleDelete}>Delete Story</button>}
          </div>

          {/* Comments */}
          <div style={S.commentsSection}>
            <h3 style={S.commentsTitle}>Comments ({blog.comments?.length || 0})</h3>
            {(blog.comments || []).length === 0
              ? <p style={S.noComments}>No comments yet. Share your thoughts!</p>
              : (blog.comments || []).map(c => (
                  <div key={c.id} style={S.commentItem}>
                    <div style={S.commentHead}>
                      <strong style={{ color:"#c9a96e", fontSize:14 }}>{c.userName}</strong>
                      <span style={{ color:"#555", fontSize:12 }}>{c.date}</span>
                    </div>
                    <p style={{ color:"#aaa", fontSize:14, margin:0, lineHeight:1.6 }}>{c.text}</p>
                  </div>
                ))
            }
            {user ? (
              <div style={S.addComment}>
                <p style={{ fontSize:13, color:"#666", margin:"0 0 8px" }}>
                  Commenting as <span style={{ color:"#c9a96e" }}>{user.name}</span>
                </p>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)}
                  placeholder="Write your comment…" rows={3} style={S.textarea} />
                <button onClick={handleComment} style={S.postBtn}>
                  {submitted ? "✓ Posted!" : "Post Comment"}
                </button>
              </div>
            ) : (
              <p style={{ color:"#666", fontSize:14 }}>
                <Link to="/login" style={{ color:"#c9a96e" }}>Sign in</Link> to comment.
              </p>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}

const S = {
  page:          { minHeight:"100vh", background:"#0d0d0d", color:"#e8e0d0", fontFamily:"'Georgia',serif", paddingBottom:80 },
  container:     { maxWidth:720, margin:"0 auto", padding:"40px 24px" },
  back:          { color:"#c9a96e", textDecoration:"none", fontSize:14, display:"inline-block", marginBottom:32 },
  meta:          { display:"flex", gap:16, alignItems:"center", marginBottom:16, flexWrap:"wrap" },
  cat:           { fontSize:11, color:"#c9a96e", textTransform:"uppercase", letterSpacing:"0.1em", background:"#1a1506", padding:"3px 10px", borderRadius:12 },
  metaText:      { fontSize:13, color:"#555" },
  title:         { fontSize:"clamp(26px,5vw,42px)", fontWeight:"bold", color:"#f0ead8", margin:"0 0 16px", lineHeight:1.2 },
  excerpt:       { fontSize:18, color:"#aaa", margin:"0 0 28px", lineHeight:1.6, fontStyle:"italic" },
  author:        { display:"flex", alignItems:"center", gap:12, marginBottom:24 },
  av:            { width:40, height:40, borderRadius:"50%", background:"#1e3a5f", color:"#93c5fd", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:"bold" },
  authorName:    { fontSize:15, color:"#d4c9b0", fontWeight:"bold" },
  authorRole:    { fontSize:12, color:"#555" },
  divider:       { height:1, background:"#1e1e1e", margin:"24px 0" },
  body:          { lineHeight:1.9 },
  para:          { fontSize:17, color:"#c8bfa8", marginBottom:20 },
  tags:          { display:"flex", gap:8, flexWrap:"wrap", marginTop:32 },
  tag:           { fontSize:12, color:"#888", background:"#141414", border:"1px solid #222", borderRadius:20, padding:"3px 10px" },
  actions:       { display:"flex", gap:12, marginTop:32 },
  likeBtn:       { padding:"10px 20px", background:"transparent", border:"1px solid #333", color:"#f87171", borderRadius:6, fontSize:15, cursor:"pointer", fontFamily:"'Georgia',serif" },
  deleteBtn:     { padding:"10px 20px", background:"#7f1d1d", border:"none", color:"#fca5a5", borderRadius:6, fontSize:15, cursor:"pointer", fontFamily:"'Georgia',serif" },
  commentsSection:{ marginTop:48, borderTop:"1px solid #1e1e1e", paddingTop:32 },
  commentsTitle: { fontSize:20, fontWeight:"normal", color:"#f0ead8", margin:"0 0 24px" },
  noComments:    { fontSize:14, color:"#555", fontStyle:"italic" },
  commentItem:   { background:"#111", border:"1px solid #1e1e1e", borderRadius:8, padding:"14px 18px", marginBottom:12 },
  commentHead:   { display:"flex", justifyContent:"space-between", marginBottom:6 },
  addComment:    { marginTop:24, display:"flex", flexDirection:"column", gap:10 },
  textarea:      { width:"100%", padding:"12px 16px", background:"#141414", border:"1px solid #2a2a2a", borderRadius:6, color:"#e8e0d0", fontSize:14, fontFamily:"'Georgia',serif", resize:"vertical", outline:"none", boxSizing:"border-box" },
  postBtn:       { alignSelf:"flex-start", padding:"10px 24px", background:"#c9a96e", border:"none", color:"#0d0d0d", borderRadius:6, fontSize:14, fontWeight:"bold", cursor:"pointer", fontFamily:"'Georgia',serif" },
};