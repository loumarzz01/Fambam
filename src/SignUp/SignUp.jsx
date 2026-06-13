
import './SignUp.css'
import { MdOutlineEmail } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

export default function SignUp() {

  return (
    <div className='container'>

      <div className='messageContainer'>

        <p style={{fontWeight: 500, textAlign: 'center'}}>Create your account</p>
        <p style={{color: "#868686", fontSize: 14, marginTop: 0, textAlign: 'center'}}>Welcome! Please fill in the details to get started.</p>

        
        <div className='input-container'>
          <p className='input-guide'>Name</p>
          <input className="input"
          placeholder='Enter your name'
          />
        </div>

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
          <p>Create an account</p>
        </button>


      </div>

    </div>
  )
}