import React, { createContext, useContext, useState } from "react";

const PostsContext = createContext(null);

const INITIAL_POSTS = [
  {
    id: 1, title: "The Future of Artificial Intelligence",
    content: "Artificial intelligence is reshaping our world in profound ways. From healthcare diagnostics that catch diseases earlier than human doctors, to climate models that predict environmental changes with unprecedented accuracy, AI is becoming the defining technology of our era. The question isn't whether AI will transform society—it already has—but how we navigate that transformation responsibly.",
    author: "Blog Writer", authorId: 2, category: "Technology",
    tags: ["AI", "Future", "Tech"], image: "https://picsum.photos/seed/ai-future/800/450",
    likes: 142, comments: [
      { id: 1, author: "Reader User", avatar: "RU", text: "Fascinating read! The healthcare applications alone are mind-blowing.", time: "2 hours ago" },
    ],
    createdAt: "2026-04-20T10:00:00Z", published: true,
  },
  {
    id: 2, title: "Mindful Living in a Digital Age",
    content: "In an era of constant notifications and infinite scroll, finding moments of genuine presence has become a radical act. Mindfulness isn't just a wellness trend—it's a necessary counterbalance to the relentless pace of digital life. Studies show that even 10 minutes of daily meditation can rewire neural pathways, reducing anxiety and improving focus.",
    author: "Blog Writer", authorId: 2, category: "Lifestyle",
    tags: ["Mindfulness", "Wellness"], image: "https://picsum.photos/seed/mindful/800/450",
    likes: 89, comments: [], createdAt: "2026-04-18T14:00:00Z", published: true,
  },
  {
    id: 3, title: "Hidden Gems: Southeast Asia on a Budget",
    content: "Beyond the tourist trails of Bangkok and Bali lies a Southeast Asia that most travelers never discover. The misty mountains of northern Laos where ancient temples sit forgotten in jungle clearings. Travel slowly. Eat locally. Talk to strangers. The real Asia reveals itself only to those willing to wander.",
    author: "Blog Writer", authorId: 2, category: "Travel",
    tags: ["Travel", "Asia", "Budget"], image: "https://picsum.photos/seed/seasia/800/450",
    likes: 203, comments: [], createdAt: "2026-04-15T09:00:00Z", published: false,
  },
];

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);

  const addPost = (post) => {
    const newPost = { ...post, id: Date.now(), likes: 0, comments: [], createdAt: new Date().toISOString(), published: false };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost   = (id, updates) => setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  const deletePost   = (id) => setPosts(prev => prev.filter(p => p.id !== id));
  const likePost     = (id) => setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  const publishPost  = (id) => updatePost(id, { published: true });
  const unpublishPost= (id) => updatePost(id, { published: false });

  const addComment = (postId, comment) => {
    setPosts(prev => prev.map(p => p.id === postId ? {
      ...p, comments: [...p.comments, { id: Date.now(), ...comment, time: "Just now" }]
    } : p));
  };

  return (
    <PostsContext.Provider value={{ posts, addPost, updatePost, deletePost, likePost, addComment, publishPost, unpublishPost }}>
      {children}
    </PostsContext.Provider>
  );
};

export const usePosts = () => useContext(PostsContext);