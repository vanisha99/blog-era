import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Fetch blog
    fetch(`http://localhost:5003/api/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        setBlog(data);
        setLoading(false);
      })
      .catch(err => console.error(err));

    // Fetch comments
    fetch(`http://localhost:5003/api/blogs/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Please login to comment');
      return;
    }

    fetch(`http://localhost:5003/api/blogs/${id}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: newComment })
    })
      .then(res => res.json())
      .then(data => {
        setComments([data, ...comments]);
        setNewComment('');
        setMessage('Comment added!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(err => setMessage('Error adding comment'));
  };

  const deleteComment = (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    fetch(`http://localhost:5003/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => setComments(comments.filter(c => c._id !== commentId)))
      .catch(err => console.error(err));
  };

  if (loading) return <h2>Loading...</h2>;
  if (!blog) return <h2>Blog not found</h2>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>{blog.title}</h1>
      <p style={{ color: '#666' }}>By {blog.author?.username || blog.author?.name || 'Unknown'}</p>
      <hr />
      <div>{blog.content}</div>
      <hr />

      <h3>Comments ({comments.length})</h3>
      {token ? (
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            style={{ width: '100%', padding: '10px', margin: '10px 0' }}
            required
          />
          <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none' }}>Post Comment</button>
        </form>
      ) : (
        <p><Link to="/login">Login</Link> to comment.</p>
      )}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div>
        {comments.length === 0 && <p>No comments yet. Be the first!</p>}
        {comments.map(comment => (
          <div key={comment._id} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px', borderRadius: '5px' }}>
            <strong>{comment.author?.username || 'User'}</strong> - <small>{new Date(comment.createdAt).toLocaleString()}</small>
            <p>{comment.content}</p>
            {(comment.author?._id === token?.userId || JSON.parse(atob(token.split('.')[1])).role === 'admin') && (
              <button onClick={() => deleteComment(comment._id)} style={{ background: 'red', color: 'white', border: 'none', padding: '3px 8px', cursor: 'pointer' }}>Delete</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogDetail;