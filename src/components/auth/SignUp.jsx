//SignUp.jsx

import './SignUp.css'
import { useState } from 'react';

import { supabase } from '../../lib/supabaseClient';

import Fambam from '../../assets/Fambam.png';

export default function SignUp( {onSwitchToSignIn}) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage ] = useState('')

  const signUp = async () => {
    const result = await supabase.auth.signUp({
      email,
      password,
    });

    const data = result.data
    const error = result.error

    setErrorMessage('')

    if (error) {
      console.log(error);
      setErrorMessage(error.message)
      return;
    }

    const userId = data.user.id;

    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          name,
        }
      ])

      if (profileError) {
        console.log(profileError);
        return;
      }

    console.log('User created:', data);
  }

  return (
    <div className='container'>

      <img src={Fambam} className="fambam-logo"/>

      <div className='message-container'>

        

        <p style={{fontWeight: 500, textAlign: 'center'}}>Create your account</p>
        <p style={{color: "#868686", fontSize: 14, marginTop: 0, textAlign: 'center'}}>Welcome! Please fill in the details to get started.</p>

        
        <div className='input-container'>
          <p className='input-guide'>Name</p>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)}
          placeholder='Enter your name'
          />
        </div>

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

        <button className="post-button" onClick={signUp}>
          <p>Create an account</p>
        </button>

        <div className="account-clarification">
          <p style={{color: '#868686', fontSize: "12px"}}>Already have an account? </p>
          <p style={{color: '#e54646', fontSize: "12px", cursor: 'pointer'}} onClick={onSwitchToSignIn}>Sign in</p>
        </div>


      </div>

    </div>
  )
}