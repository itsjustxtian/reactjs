import React, { useState } from 'react'
//continue 12:33
import { auth } from '../../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import BugHunterLogo from '../../icons/BugHunterLogo.png'; // Adjust the path based on your directory structure
import { useNavigate } from 'react-router-dom';
import Registration from './registration';
import PopUp from '../../components/PopUp';

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const signIn = (e) => {
        //sign in
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          console.log(userCredentials);
          // Call the onLogin prop passed from the parent component
          onLogin();
          // Use navigate to redirect to the dashboard
          navigate('/dashboard');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
      setShowPopup(!showPopup);
    };

    const closePopup = () => {
      setShowPopup(false);
    };

  return (
    <div className='sign-in-container'>
      
        <img src={BugHunterLogo} alt="BugHunterLogo" />
        <h1 className='content'>Log In</h1>
        <div className="content">
          <form onSubmit={signIn}>
          <label htmlFor='email'>Email:</label>
          <input
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange = {(e) => setEmail(e.target.value)}>
          </input>
        
        <br/>
        
        <div className="space"></div>

        <label htmlFor='password'>Password: </label>
        <input
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange = {(e) => setPassword(e.target.value)}>
        </input>
        <div>
          <a href="/forgot-password" className='forgotpasswordlink'>Forgot Password</a>
        </div>
        <br/>
        <div className='space'></div>
        
        <button 
          type = "submit" 
          className='buttontext' 
          id='logIn'>
            Log In
        </button>
        </form>

        <button 
          className='buttontext' 
          id='createNewAccount'
          onClick={togglePopup}>
            Create New Account
        </button>

        <PopUp show={showPopup} handleClose={closePopup}>
          <Registration handleClose={closePopup}/>
        </PopUp>

        </div>
      
    </div>
  )
}

export default SignIn