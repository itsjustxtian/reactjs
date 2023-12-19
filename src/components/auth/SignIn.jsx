import React, { useState } from 'react';
import { auth } from '../../config/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import BugHunterLogo from '../../icons/BugHunterLogo.png';
import { useNavigate } from 'react-router-dom';
import Registration from './registration';
import ForgotPassword from './forgotpassword';
import PopUp from '../../components/PopUp';

const SignIn = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        onLogin();
        sessionStorage.setItem('uid', userCredentials.user.uid);
        navigate('/dashboard');
      })
      .catch((error) => {
        let customErrorMessage = 'Invalid Login Credentials';

        if (error.code === 'auth/user-not-found') {
          customErrorMessage = 'User not found. Please check your email.';
        } else if (error.code === 'auth/wrong-password') {
          customErrorMessage = 'Incorrect password. Please try again.';
        }
        setErrorMessage(customErrorMessage);
      });
  };

  const [showPopup, setShowPopup] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);

  const togglePopup = (component) => {
    setSelectedComponent(component);
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='sign-in-container'>
      <img src={BugHunterLogo} alt="BugHunterLogo" />
      <div className="content">
        <div >
          <div id='new-line'>
            <label htmlFor='email'>Email:</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space"></div>

          <div id='new-line'>
            <label htmlFor='password'>Password: </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <button
              onClick={() => togglePopup('ForgotPassword')}
              className='forgotpasswordlink'
            >
              Forgot Password?
            </button>
          </div>

          <div className='space'></div>

          {errorMessage && <div className='error-message'>{errorMessage}</div>}

          <button
            type="submit"
            className='buttontext'
            id='logIn'
            onClick={signIn}
          >
            Log In
          </button> <br />

        </div>

        <button
          className='buttontext'
          id='register'
          onClick={() => togglePopup('Registration')}
        >
          Register
        </button>

        <PopUp show={showPopup} handleClose={closePopup}>
          {selectedComponent === 'Registration' && (
            <Registration handleClose={closePopup} />
          )}
          {selectedComponent === 'ForgotPassword' && (
            <ForgotPassword handleClose={closePopup} />
          )}
        </PopUp>
      </div>
    </div>
  );
}

export default SignIn;
