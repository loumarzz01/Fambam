//App.jsx

import {useEffect, useState, useRef} from 'react'; //imports react hooks use effect, usestate and useref from react
import { supabase } from '../supabaseClient'; //imports the supabase client with the keys from the supabase client

import { IoSend } from "react-icons/io5"; //imports the iosend react icon from the react icons dependency 

import { RiDragMove2Line } from "react-icons/ri"; //imports the drag react icon from the react icons dependency



import { FaCheck } from "react-icons/fa"; //imports the check icon from the react icons dependency

import './App.css' //imports the App.css file which is used to style the components

import Fambam from '../assets/Fambam.png'; //imports the fambam logo

import { PiSignOutBold } from "react-icons/pi"; //imports the sign out icon from the react icons dependency

export default function App() { //exports app function

  const [posts, setPosts] = useState([]); //useState is used to change the currentstate of the posts

  const [name, setName] = useState('') //usestate is used to change the currentstate of the name
  


  const fetchPosts = async () => { //a function that waits for the result
    const fetchResult = await supabase.from('posts').select('*') //Waits for supabase to select all (*) rows from post

    const data = fetchResult.data; //This is then stored in an object, data is inside the object

    const error = fetchResult.error

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

    const sessionResult = await supabase.auth.getSession()

    const sessionData = sessionResult.data;

    const userId = sessionData.session.user.id;

    const { error } = await supabase
      .from('posts')
      .insert([{ user_id: userId, name: name, content: newPost, time: now }]);

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

  const [currentUserId, setCurrentUserId] = useState('')

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

    

    setCurrentUserId(userId)


    const {data, error} = await supabase
      .from('profiles')
      .select('name') //only give name column
      .eq('id', userId) //Find rows where ID is EQUAL TO (EQ) userId
      .single(); //expect one row

      
    console.log("Looking for user:", userId);

    console.log("Profile:", data);
    console.log("Profile Error:", error);

    
    if (error) {
      setTimeout(fetchProfile, 1000)
      return;
    }

    setName(data.name)
  }

  useEffect(() => {
    fetchProfile()
  }, [])



  return (
    <div className='container'>


      <div className="sign-out-button" onClick={async () => {await supabase.auth.signOut();}} style={{position: 'absolute', top: "30px", left: "30px", display: "flex", alignItems: 'center'}}>
        <p style={{fontSize: '12px'}}>Sign Out</p>
        <PiSignOutBold />
      </div>

        
      <div className="log-in-message">
        <p>Logged in as {name}</p>
        <FaCheck style={{color: "white"}} />
      </div>
        


      <img src={Fambam} className="fambam-logo"/>

      <div className='message-container'>


        <div className='scroll'>

          {posts?.map((post) => {

            const isMine = post.user_id === currentUserId;

            return (

              <div key={post.id} 
              className={`message ${isMine ? 'my-message' : 'other-message'}`}
              >
                  
                <p className='post-name'>{post.name}</p>
                <p className="text" >{post.content}</p>
                <p className='post-time'>{post.time}</p>
                
              </div>
            )

            })}

            <div ref={bottomRef} />

          

          

          
        </div>

        <div className='message-input-container'>

          <input className="message-input"
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitPost();
              }
            }}
            placeholder='Send post'
          />

          <button className="send-button" onClick={submitPost}>
            <IoSend/>
          </button>

        </div>

        
        



      </div>

    </div>
  )
}