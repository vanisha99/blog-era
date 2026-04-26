import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CATEGORIES = ["Writing","Lifestyle","Books","Technology","Culture","Travel","Food","Essays"];

export default function CreateBlog() {
  const { addBlog, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]     = useState({ title:"", excerpt:"", content:"", category:"Writing", tags:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const tags = form.tags.split(",").map(t => t.trim().toLowerCase()).filter(Boolean);
    const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
    addBlog({
      ...form, tags,
      readTime: `${Math.ceil(wordCount / 200)} min`,
      author: user.name, authorId: user.id,
      status: user.role === "admin" ? "published" : "pending",
    });
    setLoading(false); setSuccess(true);
    setTimeout(() => navigate(user.role === "admin" ? "/admin" : "/blogger"), 1200);
  };

  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <h1 style={S.heading}>Write a Story</h1>
          <p style={S.sub}>
            {user.role === "admin" ? "Published immediately." : "Will be reviewed by admin before publishing."}
          </p>
        </div>
        {success && <div style={S.success}>✓ Story submitted! {user.role !== "admin" ? "Awaiting admin approval." : "Published!"}</div>}
        <form onSubmit={handleSubmit} style={S.form}>
          <div style={S.main}>
            <div style={S.field}>
              <label style={S.label}>Title *</label>
              <input name="title" type="text" placeholder="Your story title…"
                value={form.title} onChange={handleChange} required style={S.input}
                onFocus={e => e.target.style.borderColor="#c9a96e"}
                onBlur={e => e.target.style.borderColor="#2a2a2a"} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Excerpt *</label>
              <textarea name="excerpt" rows={2} placeholder="Short summary shown in listings…"
                value={form.excerpt} onChange={handleChange} required style={S.textarea}
                onFocus={e => e.target.style.borderColor="#c9a96e"}
                onBlur={e => e.target.style.borderColor="#2a2a2a"} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Content *</label>
              <textarea name="content" rows={14} placeholder="Write your story here…"
                value={form.content} onChange={handleChange} required style={S.textarea}
                onFocus={e => e.target.style.borderColor="#c9a96e"}
                onBlur={e => e.target.style.borderColor="#2a2a2a"} />
              <div style={{ fontSize:12, color:"#555", textAlign:"right", marginTop:4 }}>
                {wordCount} words · ~{Math.ceil(wordCount/200)} min read
              </div>
            </div>
          </div>
          <div style={S.sidebar}>
            <div style={S.sideCard}>
              <h3 style={S.sideTitle}>Story Details</h3>
              <div style={S.field}>
                <label style={S.label}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} style={S.select}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div style={S.field}>
                <label style={S.label}>Tags (comma-separated)</label>
                <input name="tags" type="text" placeholder="writing, craft, focus"
                  value={form.tags} onChange={handleChange} style={S.input}
                  onFocus={e => e.target.style.borderColor="#c9a96e"}
                  onBlur={e => e.target.style.borderColor="#2a2a2a"} />
              </div>
              <div style={S.field}>
                <label style={S.label}>Author</label>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:30, height:30, borderRadius:"50%", background:"#1e3a5f", color:"#93c5fd", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:"bold" }}>{user.name[0]}</div>
                  <span style={{ fontSize:14, color:"#d4c9b0" }}>{user.name}</span>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background: user.role==="admin" ? "#22c55e" : "#eab308", display:"inline-block" }} />
                <span style={{ fontSize:13, color:"#888" }}>{user.role==="admin" ? "Publishes immediately" : "Requires admin approval"}</span>
              </div>
              <button type="submit" disabled={loading||success}
                style={{ ...S.submitBtn, opacity:loading||success?0.7:1, cursor:loading||success?"not-allowed":"pointer" }}>
                {loading ? "Submitting…" : success ? "✓ Submitted!" : "Submit Story"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const S = {
  page:      { minHeight:"100vh", background:"#0d0d0d", color:"#e8e0d0", fontFamily:"'Georgia',serif", paddingBottom:60 },
  container: { maxWidth:1100, margin:"0 auto", padding:"40px 24px" },
  header:    { marginBottom:24 },
  heading:   { fontSize:32, fontWeight:"normal", color:"#f0ead8", margin:"0 0 8px" },
  sub:       { color:"#888", fontSize:15, margin:0 },
  success:   { padding:"14px 20px", background:"#1a2e1a", border:"1px solid #2d4a2d", color:"#86efac", borderRadius:8, marginBottom:24, fontSize:15 },
  form:      { display:"grid", gridTemplateColumns:"1fr 300px", gap:32 },
  main:      { display:"flex", flexDirection:"column", gap:20 },
  field:     { display:"flex", flexDirection:"column", gap:8 },
  label:     { fontSize:12, color:"#666", textTransform:"uppercase", letterSpacing:"0.08em" },
  input:     { width:"100%", padding:"12px 16px", background:"#141414", border:"1px solid #2a2a2a", borderRadius:6, color:"#e8e0d0", fontSize:15, fontFamily:"'Georgia',serif", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s" },
  textarea:  { width:"100%", padding:"12px 16px", background:"#141414", border:"1px solid #2a2a2a", borderRadius:6, color:"#e8e0d0", fontSize:15, fontFamily:"'Georgia',serif", outline:"none", resize:"vertical", boxSizing:"border-box", transition:"border-color 0.2s" },
  sidebar:   {},
  sideCard:  { background:"#111", border:"1px solid #1e1e1e", borderRadius:10, padding:24, display:"flex", flexDirection:"column", gap:18, position:"sticky", top:24 },
  sideTitle: { fontSize:16, fontWeight:"bold", color:"#f0ead8", margin:0 },
  select:    { width:"100%", padding:"10px 14px", background:"#141414", border:"1px solid #2a2a2a", borderRadius:6, color:"#e8e0d0", fontSize:14, fontFamily:"'Georgia',serif", outline:"none" },
  submitBtn: { padding:14, background:"#c9a96e", border:"none", borderRadius:6, color:"#0d0d0d", fontSize:15, fontWeight:"bold", fontFamily:"'Georgia',serif", cursor:"pointer", width:"100%" },
};