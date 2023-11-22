import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import { db } from '../../config/firebase-config';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase-config'; // Import only necessary modules

const Registration = () => {
    const [input, setInput] = useState({
        companyid: '',
        email: '',
        contactnumber: '',
        firstname: '',
        lastname: '',
        birthdate: null,
        password: '123456',
    });

    const inputHandler = (e) => {
        const { name, value } = e.target;

        setInput((prevInput) => ({
            ...prevInput,
            [name]: value,
        }));
    };

    const dateHandler = (date) => {
        setInput((prevInput) => ({
            ...prevInput,
            birthdate: date,
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            if (input) {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    input.email,
                    input.password
                );
                const user = userCredential.user;

                await addDoc(collection(db, 'users'), {
                    companyid: input.companyid,
                    email: input.email,
                    contactnumber: input.contactnumber,
                    firstname: input.firstname,
                    lastname: input.lastname,
                    birthdate: input.birthdate,
                    password: input.password,
                    datecreated: serverTimestamp(),
                });

                setInput({
                    companyid: '',
                    email: '',
                    contactnumber: '',
                    firstname: '',
                    lastname: '',
                    birthdate: null,
                    password: '123456',
                });

                // console.log('Registration successful! User registered and data stored:', user)
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    return (
        <div className='sign-up-container'>
            <form onSubmit={submitHandler}>
                <h1>Register New User</h1>

                {/* Removed Profile Picture Module */}

                <br />
                <div>
                    <div className='sign-up-left'>
                        <label>Company ID: </label>
                        <input
                            type='text'
                            placeholder='Company ID'
                            value={input.companyid}
                            onChange={(e) => inputHandler(e)}
                            name='companyid'
                        />
                    </div>

                    <div className='sign-up-left'>
                        <label>Email: </label>
                        <input
                            type='email'
                            placeholder='Email'
                            value={input.email}
                            onChange={(e) => inputHandler(e)}
                            name='email'
                        />

                        <label>Contact Number: </label>
                        <input
                            type='tel'
                            pattern='[0-9]*'
                            placeholder='Contact Number'
                            value={input.contactnumber}
                            onChange={(e) => inputHandler(e)}
                            name='contactnumber'
                        />
                    </div>

                    <div className='sign-up-left'>
                        <label>First Name: </label>
                        <input
                            type='text'
                            placeholder='First name'
                            value={input.firstname}
                            onChange={(e) => inputHandler(e)}
                            name='firstname'
                        />
                        <label>Last Name: </label>
                        <input
                            type='text'
                            placeholder='Last Name'
                            value={input.lastname}
                            onChange={(e) => inputHandler(e)}
                            name='lastname'
                        />
                    </div>

                    <div className='sign-up-left'>
                        <label>Date of Birth: </label>
                        <DatePicker
                            dateFormat='yyyy/MM/dd'
                            placeholderText='Birthdate'
                            selected={input.birthdate}
                            onChange={(date) => dateHandler(date)}
                        />
                    </div>
                </div>

                <br />
                <div className='register-cancel-container'>
                    <button id='register' type='submit'>
                        Register
                    </button>

                    <button id='cancel'>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
