//Chat.jsx

import {useEffect, useState, useRef} from 'react'; //imports react hooks use effect, usestate and useref from react
import { supabase } from '../../lib/supabaseClient'; //imports the supabase client with the keys from the supabase client

import { IoSend } from "react-icons/io5"; //imports the iosend react icon from the react icons dependency 


import './Chat.css' //imports the App.css file which is used to style the components

import Fambam from '../../assets/Fambam.png'; //imports the fambam logo

import { PiSignOutBold } from "react-icons/pi"; //imports the sign out icon from the react icons dependency

export default function Chat() { //exports app function

  const [posts, setPosts] = useState([]); //useState is used to change the currentstate of the array, posts

  const [name, setName] = useState('') //usestate is used to change the currentstate of the string, name
  


  const fetchPosts = async () => { //a function that waits for the result
    const fetchResult = await supabase.from('posts').select('*') //Waits for supabase to select all (*) rows from post

    const data = fetchResult.data; //This line takes the data property from the fetchResult object and stores it in a new variable called data

    const error = fetchResult.error //This line takes the error property from the fetchResult object and stores it a new variable called data

    if (error) { //If something inside error exists
      console.log(error); //then that error is shown in the console
      return; //this stops the function immediately
    }

    

    setPosts(data || []); //posts is then set to the either the data retrieved or nothing
  }
  
  useEffect(() => { //runs when the app refreshes
    const load = async () => { //This function waits until fetch posts has run
      fetchPosts() //This is calls the function fetchPosts()
    }

    const interval = setInterval(() => { //This creates an interval function
      load() //This calls the load function which waits for the fetchPosts() function to finish fetching data
    }, 2000) //It is run every 2000 miliseconds (2 seconds)

    return () => clearInterval(interval) //The interval is then cleared in a return statement to avoid taking up anymore memory
  }, []);

  const [newPost, setNewPost] = useState('') //useState is used to change the currentstate of the string variable newPost




  const submitPost = async () => { //This is a function that waits for results

    console.log("Post:", newPost); //The new post variable is logged to the console
    console.log("Name:", name); //The name variable is logged to the console

    if (!newPost) { //If newPost is empty
      return; // stop this function
    }

    const now = new Date().toLocaleTimeString([], { //the variable 'now' is set as a string of the local time
      hour: '2-digit', //The hour is set to 2-digits
      minute: '2-digit' //The minute is set to 2-digits
    });

    const sessionResult = await supabase.auth.getSession() //Ask Supabase for the user's current logged in session, wait for the answer, and store the result in a variable called sessionResult

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


      


      <img src={Fambam} className="fambam-logo"/>



      <div className='header-buttons'>
        <div className='chat-button'>
        </div>

        <div>
          
        </div>
      </div>

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

      <div className='bottom-info-wrapper'>
        <div className="sign-out-button" onClick={async () => {await supabase.auth.signOut();}}>
          <p style={{fontSize: '12px'}}>Sign Out</p>
          <PiSignOutBold />
        </div>

          
        <div className="log-in-message">
          <p>Logged in as {name}</p>
        </div>
      </div>
        

    </div>
  )
}