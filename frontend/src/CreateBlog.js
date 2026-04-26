import React, { useState } from 'react';

function CreateBlog() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Please login first');
      window.location.href = '/login';
      return;
    }

    fetch('http://localhost:5003/api/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content })
    })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setMessage('Blog created successfully!');
          setTimeout(() => window.location.href = '/', 2000);
        } else {
          setMessage('Failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch(err => setMessage('Error: ' + err.message));
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="10"
          style={{ width: '100%', padding: '10px', margin: '10px 0' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
          Create Blog
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateBlog;