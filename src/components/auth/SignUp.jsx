import React, { useState } from 'react'
//continue 12:33
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = (e) => {
        //sign in
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
            console.log(userCredentials);
        })
        .catch((error) => {
            console.log(error);
        });
    }

  return (
    <div className='sign-in-container'>
      <form onSubmit={signUp}>
        <h1 className='content'>Sign Up</h1>
        <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange = {(e) => setEmail(e.target.value)}>
        </input>
        <br/>
        <input
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange = {(e) => setPassword(e.target.value)}>
        </input>
        <br/>
        <button type = "submit">Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp
