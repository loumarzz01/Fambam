import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

import './App.css';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState('');
  const [newPost, setNewPost] = useState('');

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*');

    if (error) {
      console.log(error);
      return;
    }

    setPosts(data || []);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const submitPost = async () => {
    if (!name || !newPost) return;

    const { error } = await supabase
      .from('posts')
      .insert([{ name: name, content: newPost }]);

    if (error) {
      console.error(error);
      return;
    }

    fetchPosts();
    setNewPost('');
  };

  return (
    <div>
    <div className="scroll">
      {posts?.map((post) => (
        <p
          key={post.id}
          style={{
            color: post.name === 'Louis' ? 'red' : 'black',
            fontWeight: post.name === 'Louis' ? 'bold' : 'lighter',
          }}
        >
          <b>{post.name}</b> - {post.content}
        </p>
      ))}

      
    </div>

    <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />

      <input
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder="Send post"
      />

      <button onClick={submitPost}>Post</button>

      <p>(scroll up and down to view all posts)</p>
    </div>
  );
}