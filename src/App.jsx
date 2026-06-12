import {useEffect, useState, useRef} from 'react';
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
    const load = async () => {
      fetchPosts()
    }

    const interval = setInterval(() => {
      load()
    }, 2000)

    return () => clearInterval(interval)
  }, []);

  const [newPost, setNewPost] = useState('')

  const submitPost = async () => {

    if (!newPost || !name) {
      return;
    }

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

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: 'smooth'})
  }, [posts])


  return (
    <div className='container'>

      <div>


        <div className='scroll'>
          <div className='messages'>
            {posts?.map((post) => (
              <p className="text" style={{color: post.name === 'Louis' ? "red" : "black", fontWeight: post.name === 'Louis' ? "bold" : "lighter"}} key={post.id}>{post.name} - {post.content}</p>
            ))}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className='container2'>
          <input className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder='Enter name'
          />

          <input className="input"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder='Send post'
          />

          

          <button className="post-button" onClick={submitPost}>Post</button>


          <p className="text">(scroll up and down to view all messages)</p>
        </div>



      </div>

    </div>
  )
}