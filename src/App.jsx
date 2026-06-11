import {useEffect, useState} from 'react';
import { supabase } from './supabaseClient';

import './App.css'

export default function App() {

  const [posts, setPosts] = useState([]);

  const [name, setName ] = useState('')

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

  useEffect(() => {
    fetchPosts();
  }, []);

  const [newPost, setNewPost] = useState('')

  const submitPost = async () => {
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
    <div >
      <div className='scroll'>
        {posts?.map((post) => (
          <p style={{color: post.name === 'Louis' ? "red" : "black", fontWeight: post.name === 'Louis' ? "bold" : "lighter"}} key={post.id}>{post.name} - {post.content}</p>
        ))}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder='Enter name'
      />

      <input
        value={newPost}
        onChange={(e) => setNewPost(e.target.value)}
        placeholder='Send post'
      />

      

      <button onClick={submitPost}>Post</button>


      <p>(scroll up and down to view all messages)</p>
    </div>
  )
}