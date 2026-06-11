import {useEffect, useState} from 'react';
import { supabase } from './supabaseClient';

import './App.css'

export default function App() {

  const [posts, setPosts] = useState([]);

  const [name, setName] = useState("")


  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('*');

      if (error) {
        console.log(error);
        return;
      }

    setPosts(data || []);
  }

  const [newPost, setNewPost] = useState('')

  

  const submitPost = async () => {
    const { error } = await supabase
      .from('posts')
      .insert([{ content: `${name} - ${newPost}` }]);

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

      
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name'/>
      <input value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder='Send post'/>
      <button onClick={submitPost}> Post</button>
    </div>
  )
}