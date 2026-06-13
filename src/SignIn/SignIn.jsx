
import './SignIn.css'
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

export default function SignUp() {

  return (
    <div className='container'>

      <div className='messageContainer'>

        <p style={{fontWeight: 500, textAlign: 'center'}}>Sign in to Fambam</p>
        <p style={{color: "#868686", fontSize: 14, marginTop: 0, textAlign: 'center'}}>Welcome back! Please sign in to continue.</p>

      

        <div className='input-container'>
          <p className='input-guide'>Email address</p>
          <input className="input"
          placeholder='Enter your email address'
          />
        </div>
        
        <div className='input-container'>
          <p className='input-guide'>Password</p>
          <input className="input"
          placeholder='Enter enter your password'
          />
        </div>

        <button className="post-button">
          <p>Sign In</p>
        </button>


      </div>

    </div>
  )
}