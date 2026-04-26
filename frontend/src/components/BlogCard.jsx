import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./BlogCard.css";

export default function BlogCard({ blog, showActions = false }) {
  const { user, deleteBlog, updateBlogStatus, likeBlog } = useAuth();

  const canDelete = user?.role === "admin" || user?.id === blog.authorId;
  const canPublish = user?.role === "admin";

  return (
    <article className={`blog-card fade-up ${blog.status === "pending" ? "pending" : ""}`}>
      <div className="card-meta">
        <span className="card-category">{blog.category}</span>
        <span className="card-date">{blog.date}</span>
        {blog.status === "pending" && <span className="card-status pending">Pending Review</span>}
        {blog.status === "published" && showActions && <span className="card-status published">Published</span>}
      </div>

      <Link to={`/blog/${blog.id}`}>
        <h2 className="card-title">{blog.title}</h2>
      </Link>

      <p className="card-excerpt">{blog.excerpt}</p>

      <div className="card-footer">
        <div className="card-author">
          <div className="author-avatar">{blog.author[0]}</div>
          <div>
            <div className="author-name">{blog.author}</div>
            <div className="author-read">{blog.readTime} read</div>
          </div>
        </div>

        <div className="card-actions">
          <button className="card-like" onClick={() => likeBlog(blog.id)}>
            ♥ <span>{blog.likes}</span>
          </button>
          <span className="card-comments">◎ {blog.comments}</span>

          {showActions && canPublish && blog.status === "pending" && (
            <button className="action-btn publish" onClick={() => updateBlogStatus(blog.id, "published")}>
              Publish
            </button>
          )}
          {showActions && canDelete && (
            <button className="action-btn delete" onClick={() => deleteBlog(blog.id)}>
              Delete
            </button>
          )}
        </div>
      </div>

      {blog.tags?.length > 0 && (
        <div className="card-tags">
          {blog.tags.map(t => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}
    </article>
  );
}