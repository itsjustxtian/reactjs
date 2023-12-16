import React, { useState } from 'react'
import { auth, db } from '../../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import BugHunterLogo from '../../icons/BugHunterLogo.png'; // Adjust the path based on your directory structure
import { useNavigate } from 'react-router-dom';
import Registration from './registration';
import PopUp from '../../components/PopUp';
import { getDoc, query, where, collection } from 'firebase/firestore';

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // New state for error message
    const navigate = useNavigate();
    
    const signIn = (e) => {
        //sign in
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          console.log(userCredentials);
          // Call the onLogin prop passed from the parent component
          onLogin();
          sessionStorage.setItem('uid', userCredentials.user.uid);

          navigate('/dashboard');
        })
        .catch((error) => {
            console.log(error);
            let customErrorMessage = 'Invalid Login Credentials';

            if (error.code === 'auth/user-not-found') {
              customErrorMessage = 'User not found. Please check your email.';
            } else if (error.code === 'auth/wrong-password') {
              customErrorMessage = 'Incorrect password. Please try again.';
            }
            setErrorMessage(customErrorMessage);

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
        <div className="content">
          <form onSubmit={signIn}>
          <div id='new-line'>
            <label htmlFor='email'>Email:</label>
            <input
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange = {(e) => setEmail(e.target.value)}>
            </input>
          </div>
        
        <div className="space"></div>

        <div id='new-line'>
          <label htmlFor='password'>Password: </label>
          <input
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange = {(e) => setPassword(e.target.value)}>
          </input>
        </div>
        
        {/*<div>
          <a href="/forgot-password" 
          className='forgotpasswordlink'>
            Forgot Password
          </a>
  </div>*/}

        <div className='space'></div>

        {/* Display error message if present */}
        {errorMessage && <div className='error-message'>{errorMessage}</div>}

        <button 
          type = "submit" 
          className='buttontext' 
          id='logIn'>
            Log In
        </button> <br/>
        
        </form>

        <button 
          className='buttontext' 
          id='register'
          onClick={togglePopup}>
            Register
        </button>
        

        <PopUp show={showPopup} handleClose={closePopup}>
          <Registration handleClose={closePopup}/>
        </PopUp>

        </div>
      
    </div>
  )
}

export default SignIn