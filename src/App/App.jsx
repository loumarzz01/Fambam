//App.jsx

import {useEffect, useState, useRef} from 'react';
import { supabase } from '../supabaseClient';

import { IoSend } from "react-icons/io5";

import './App.css'

import Fambam from '../assets/Fambam.png';

export default function App() {

  const [posts, setPosts] = useState([]);

  const [name, setName] = useState('')


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

    console.log("Post:", newPost);
    console.log("Name:", name);

    if (!newPost) {
      return;
    }

    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    const { error } = await supabase
      .from('posts')
      .insert([{ name: name, content: newPost, time: now }]);

    console.log("Insert Error:", error)

    if (error) {
      console.error(error);
      return;
    }



    fetchPosts();
    setNewPost('');
  };

  const bottomRef = useRef(null);
  const prevCountRef = useRef(0)

  useEffect(() => {
    if (posts.length > prevCountRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth'})
    }

    prevCountRef.current = posts.length;
    
  }, [posts])

  
  const fetchProfile = async () => {
    const {data: sessionData } = await supabase.auth.getSession(); //const data = result.session

    console.log("Session:", sessionData)

    const userId = sessionData.session.user.id;

    if (!userId) {
      console.log("No logged in user")
      return;
    }


    const {data, error} = await supabase
      .from('profiles')
      .select('name') //only give name column
      .eq('id', userId) //Find rows where ID is EQUAL TO (EQ) userId
      .single(); //expect one row

      
    console.log("Looking for user:", userId);

    console.log("Profile:", data);
    console.log("Profile Error:", error);

    
    if (error) {
      return;
    }

    setName(data.name)
  }

  useEffect(() => {
    fetchProfile()
  }, [])



  return (
    <div className='container'>

      <img src={Fambam} className="fambam-logo"/>

      <div className='message-container'>


        <div className='scroll'>

          {posts?.map((post) => (
            <div className='message'>
                
              <p className='post-name'>{post.name}</p>
              <p className="text" key={post.id}>{post.content}</p>
              <p className='post-time'>{post.time}</p>
            </div>
          ))}

          <div ref={bottomRef} />

          
        </div>

        <div className='message-input-container'>

          <input className="message-input"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder='Send post'
          />

          <button className="send-button" onClick={submitPost}>
            <IoSend/>
          </button>

        </div>

        <button
        onClick={async () => {
          await supabase.auth.signOut();
        }}
        >
          Sign Out
        </button>

        



      </div>

    </div>
  )
}