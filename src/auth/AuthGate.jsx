//AuthGate.jsx

import { useEffect, useState } from 'react';

import { supabase } from '../lib/supabaseClient';

import App from '../pages/App';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

export default function AuthGate() {
    const [session, setSession] = useState(null);

    const [loading, setLoading] = useState(true);

    const [showSignUp, setShowSignUp] = useState(false);



    useEffect(() => {
        const getSession = async () => {
            const result = await supabase.auth.getSession();

            const data = result.data

            console.log("Session from Supabase:", data.session)

            setSession(data.session);
            setLoading(false);
        };

        getSession();

        //Listens for changes in authentication state

        const authListener = supabase.auth.onAuthStateChange(
            (event, session) => { //Function runs every time auth state changes. The ongoing connection of being notified whenever a state changes is called a 'subscription'
                setSession(session)
            }
        )

        const subscription = authListener.data.subscription; //Listener returns an object that contains a "subscription"

        return () => { 
            subscription?.unsubscribe() //Stops listening to avoid memory leaks. Return means "when this component leaves the screen, clean up the subscription"
        }


    }, [])

    if (loading) {
        return <p style={{fontFamily: "Poppins"}}> Loading... </p>;
    }

    if (session) {
        return <App />
    }

    return showSignUp ? <SignUp onSwitchToSignIn={() => setShowSignUp(false)}/> : <SignIn onSwitchToSignUp={() => setShowSignUp(true)}/>

}