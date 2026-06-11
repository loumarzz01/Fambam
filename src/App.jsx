import {useEffect, useState} from 'react';
import { supabase } from './supabaseClient';

export default function App() {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
  const { data, error } = await supabase
    .from('posts')
    .select('*');

  setPosts(data);
}

  const [newPost, setNewPost] = useState('')

  const submitPost = async () => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{ content: newPost }]);

  if (error) {
    console.error(error);
    return;
  }

  fetchPosts();
  setNewPost('');
  };


  return (
    <div>
      {posts?.map((post) => (
        <p key={post.id}> {post.content}</p>
      ))}

      <input value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder='Send post'/>
      <button onClick={submitPost}> Post</button>
    </div>
  )
}