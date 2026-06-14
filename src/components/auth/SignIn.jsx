//SignIn.jsx


import './SignIn.css'
import { useState } from 'react';

import { supabase } from '../../lib/supabaseClient';

import Fambam from '../../assets/Fambam.png';

export default function SignUp( {onSwitchToSignUp}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage ] = useState('')

  const signIn = async () => {
    const result = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    const data = result.data
    const error = result.error


    if (error) {
      setErrorMessage(error.message)
      console.error(error)
      return;
    }

    console.log(data);
    console.log('User:', data.user);
    console.log('Session:', data.session);
  }

  return (
    <div className='container'>

      <img src={Fambam} className="fambam-logo"/>

      <div className='message-container'>

        <p style={{fontWeight: 500, textAlign: 'center'}}>Sign in to Fambam</p>
        <p style={{color: "#868686", fontSize: 14, marginTop: 0, textAlign: 'center'}}>Welcome back! Please sign in to continue.</p>

      

        <div className='input-container'>
          <p className='input-guide'>Email address</p>
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
          />
        </div>
        
        <div className='input-container'>
          <p className='input-guide'>Password</p>
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter enter your password'
          />
        </div>

        {errorMessage && (
            <p
              style={{
                color: '#e54646',
                fontSize: '12px',
                marginTop: '8px'
              }}
            >
            {errorMessage}
            </p>
        )}

        
          

        <button className="post-button" onClick={signIn}>
          <p>Sign In</p>
        </button>

        <div className="account-clarification">
          <p style={{color: '#868686', fontSize: "12px",}}>Don't have an account yet? </p>
          <p style={{color: '#e54646', fontSize: "12px", cursor: 'pointer'}} onClick={onSwitchToSignUp}>Create an account </p>
        </div>


      </div>

    </div>
  )
}