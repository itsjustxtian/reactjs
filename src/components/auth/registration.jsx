import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import { db } from '../../config/firebase-config';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';


const Registration = () => {
   
    const [input, setInput] = useState("");

    const emailHandler = (e) =>{
        setInput(e.target.value);
    }

    const submitHandler = async (e) =>{
        e.preventDefault();
        if(input){
            await addDoc(collection(db, "users"), {
                email: input,
                datecreated: serverTimestamp(),
            })
            setInput("");
        }
    }

    return (
        <div className='sign-up-container'>
        <form onSubmit={submitHandler}>
            <h1 >Register New User</h1>

            {/*Profile Picture Module */}
        <div className='profile-picture-component'>
            <Avatar 
            alt="Profile Picture" 
            sx={{width:200, height:200}}
            
            />
        </div>

            <br/>
            <div>
                <div className='sign-up-left'>
                    <label>Company ID: </label>
                    <input
                        type="text" 
                        placeholder="Company ID"
                    />
                </div>
                
                <div className='sign-up-left'>
                    <label>Email: </label>
                    <input
                        type="email" 
                        placeholder="Email" 
                        value={input}
                        onChange={inputHandler}
                    />

                    <label>Contact Number: </label>
                    <input
                        type="tel" 
                        pattern='[0-9]*'
                        placeholder="Contact Number"
                    />
                </div>

                <div className='sign-up-left'>
                    <label>First Name: </label>
                    <input
                        type="text" 
                        placeholder="First name" 
                    />
                    <label>Last Name: </label>
                    <input
                        type="text" 
                        placeholder="Last Name" 
                    />
                </div>

                <div className='sign-up-left'>
                    <label>Date of Birth: </label>
                    <DatePicker
                        dateFormat="yyyy/MM/dd" 
                        placeholderText='Birthdate'
                        />
                </div>

            </div>

        <br/>
            <div className='register-cancel-container'>
                <button id='register' type='submit'>
                    Register
                </button>

                <button id='cancel'>
                    Cancel
                </button>
            </div>
        </form>
        </div>
    );
}

export default Registration;
