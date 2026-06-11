import { createClient } from "@supabase/supabase-js"; //Imports the libray to talk to supabase


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_URL

export const supabase = createClient(supabaseUrl, supabaseKey) //Initialize the client and export it to use it anywhere in your app


const addPost = async (content) => { //async marks this as a function that talks to an external server
    const {data, error} = await supabase //'await' pauses the execution until supabase responds
    .from('posts') //Selects the specific table in supabase named 'posts'
    .insert([{ content, user_id: user.id}]); // 'insert' adds a new row; the text and ID of the logged-in user is stored
}

const fetchPosts = async () => {
    let { data: posts, error }  = await supabase //Making request to get data. If request is sucessful, data holds information requested. If failed, then error will contain error details
    .from('posts') //Targeting the 'posts' table
    .select('*') // '*' is shorthand for 'get all columns' for each row

    //After this, 'posts' will contain an array of objects representing the database rows
}