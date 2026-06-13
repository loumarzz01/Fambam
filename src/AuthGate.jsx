import { useEffect, useState } from 'react';

import {supabase } from './supabaseClient'

import App from './App/App';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';

export default function AuthGate() {
    const [session, setSession] = useState(null);

    const [loading, setLoading] = useState(false);

    const [showSignUp, setShowSignUp] = useState(false);



    useEffect(() => {
        const getSession = async () => {
            const {data} = await supabase.auth.getSession();

            setSession(data.session);
            setLoading(false);
        };

        getSession();
    }, [])

    if (loading) {
        return <p style={{fontStyle: "poppins"}}> Loading... </p>;
    }

    if (session) {
        return <App />
    }

    return showSignUp ? <SignUp onSwitchToSignIn={() => setShowSignUp(false)}/> : <SignIn onSwitchToSignUp={() => setShowSignUp(true)}/>

}