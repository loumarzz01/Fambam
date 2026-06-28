//Connected Discord-Github. Discord: l.mrz Roblox: loumarzzz00

import {useEffect, useState, useRef} from 'react'; //imports react hooks use effect, usestate and useref from react
import { supabase } from '../../lib/supabaseClient'; //imports the supabase client with the keys from the supabase client

import { IoSend } from "react-icons/io5"; //imports the iosend react icon from the react icons dependency 

import { BsFillLightbulbFill } from "react-icons/bs";

import { IoChatbox } from "react-icons/io5";


import './Chat.css' //imports the Chat.css file which is used to style the components

import Fambam from '../../assets/Fambam.png'; //imports the fambam logo

import { PiSignOutBold } from "react-icons/pi"; //imports the sign out icon from the react icons dependency

export default function Chat() { //exports app function

  const [posts, setPosts] = useState([]); //useState is used to change the currentstate of the array, posts

  const [name, setName] = useState('') //usestate is used to change the currentstate of the string, name
  


  const fetchPosts = async () => { //a function that waits for the result
    const fetchResult = await supabase.from('posts').select('*') //Waits for supabase to select all (*) rows from post

    const data = fetchResult.data; //This line takes the data property from the fetchResult object and stores it in a new variable called data

    const error = fetchResult.error //extracts error from the supabase response

    if (error) { //If something inside error exists
      console.log(error); //then that error is shown in the console
      return; //this stops the function immediately
    }

    

    setPosts(data || []); //posts is then set to the either the data retrieved or nothing
  }
  
  useEffect(() => { //runs once on mount
    const load = async () => { //This function waits until fetch posts has run
      fetchPosts() //This is calls the function fetchPosts()
    }

    const interval = setInterval(() => { //This creates an interval function
      load() //This calls the load function which waits for the fetchPosts() function to finish fetching data
    }, 2000) //It is run every 2000 miliseconds (2 seconds)

    return () => clearInterval(interval) //The interval is then cleared in a return statement to avoid memory leaks
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

    const sessionData = sessionResult.data; //extracts the session object from the supabase response

    const userId = sessionData.session.user.id; //through the current log in session and the logged-in user object, the user ID is found

    const { error } = await supabase //extracts only the error from the response
      .from('posts') //looks through the posts table
      .insert([{ user_id: userId, name: name, content: newPost, time: now }]); //inserts a new row into the posts table which contains the user id, the name, the content, and the time

    console.log("Insert Error:", error)

    if (error) { //if there is an error it will be displayed in the console
      console.error(error);
      return;
    }

    
    


    fetchPosts(); //retrieves the posts from supabase again
    setNewPost(''); //resets the input to an empty string
  };

  

  const bottomRef = useRef(null); //creates a reference for the element that is below the chat bubbles
  const prevCountRef = useRef(0); 

  const [currentUserId, setCurrentUserId] = useState('')

  useEffect(() => { //runs whenever the posts variable changes
    if (posts.length > prevCountRef.current) { //checks if the posts number increases
      bottomRef.current?.scrollIntoView({ behavior: 'smooth'}) //if it did increase then the page will automatically scroll to the element at the bottom of the chat posts list with a smooth animation
    }

    prevCountRef.current = posts.length; //the prevCountRef stores the latest number of posts
    
  }, [posts])

  
  const fetchProfile = async () => {
    const {data: sessionData } = await supabase.auth.getSession(); //gets the session data from the supabase auth response

    console.log("Session:", sessionData) //the data inside the sessionData variable is displayed in the console

    const userId = sessionData.session.user.id; //looks into the sessionData object and finds the user ID

    if (!userId) { //if the user id does not exist
      console.log("No logged in user") //then a message will be displayed in the console
      return;
    }

    

    setCurrentUserId(userId) //setCurrentUserId stores the id of the user


    const {data, error} = await supabase //both the data and error messages are retrieved from the request
      .from('profiles')
      .select('name') //only give name column
      .eq('id', userId) //Find rows where ID is EQUAL TO (EQ) userId
      .single(); //expect one row

      
    console.log("Looking for user:", userId); //The user id that is being searched is displayed in the console

    console.log("Profile:", data); //the profile data is displayed in the console
    console.log("Profile Error:", error); //any profile errors are displayed in the console

    
    if (error) { //if there is an error
      setTimeout(fetchProfile, 1000) //the fetchProfile function will retry after 1 second
      return;
    }

    setName(data.name) //the name variables holds the name property in the data object
  }

  useEffect(() => { 
    fetchProfile() //the fetchProfile function is ran when the screen updates
  }, [])

  const [idea, setIdea] = useState(false)


  return (



      


      

      <div className='container2'>

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

                <div ref={bottomRef} />
                
              </div>
            )

            })}

            

          

          

          
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