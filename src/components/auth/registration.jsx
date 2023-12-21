import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import { storage, db } from '../../config/firebase-config';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { query, getDocs, where } from 'firebase/firestore';

const Registration = ({handleClose}) => {
    const handleCancel = () => {
        handleClose();
    };

    const [input, setInput] = useState({
        uid: '',
        companyid: '',
        email: '',
        contactnumber: '',
        firstname: '',
        lastname: '',
        birthdate: null,
        profilePicture: '',
        password: '',
        confirmpassword: '',
        role: '',
        status: ''
    });

    const inputHandler = (e) => {
        const { name, value } = e.target;
        
        if (name === 'companyid') {
            // Format the Company ID as "00-0000-00"
                const formattedValue = value
                .replace(/[^\d]/g, '') // Remove non-numeric characters
                .replace(/^(\d{2})(\d{0,4})?(\d{0,4})?$/, (match, p1, p2, p3) => {
                let result = p1;
                if (p2) result += `-${p2}`;
                if (p3) result += `-${p3}`;
                return result;
                })
                .slice(0,11);
              

            setInput((prevInput) => ({
                ...prevInput,
                [name]: formattedValue,
            }));
        } else {
            setInput((prevInput) => ({
                ...prevInput,
                [name]: value,
            }));
        }
    } ;

    const dateHandler = (date) => {
        setInput((prevInput) => ({
            ...prevInput,
            birthdate: date,
        }));
    };

    //const [profilePicture, setProfilePicture] = useState(null);
    const [avatar, setAvatar] = useState(null); // Changed from 'profilePicture' to 'avatar' for consistency
    const [file, setFile] = useState(null);

    const changeProfilePicture = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setAvatar(URL.createObjectURL(selectedFile));
    };

    const[errormessage, setErrorMessage] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            setErrorMessage('');

             // Check if any of the required fields are empty
            const requiredFields = ['companyid', 'email', 'contactnumber', 'firstname', 'lastname', 'birthdate', 'password', 'confirmpassword'];
            const emptyFields = requiredFields.filter(field => !input[field]);

            if (emptyFields.length > 0) {
                setErrorMessage('All fields are required to be filled.');
                return;
            }

            if(input.password !== input.confirmpassword){
                console.log("Password and Confirm Password do not match.");
                setErrorMessage("Password and Confirm Password do not match.");
                return;
            } else {
                if (input) {
                    // Check if the email or Company ID already exists
                    console.log('Checking if email exists:', input.email);
                    console.log('Checking if Company ID exists:', input.companyid);

                    const companyIdExists = await checkIfFieldExists('companyid', input.companyid);
                    
                    if (companyIdExists) {
                        setErrorMessage('Company ID already exists. Please choose another Company ID.');
                        console.log('Company ID exists?', companyIdExists);
                        console.log('Component Rendered! Company ID.');                        
                        return;
                    }
                    
                    const emailExists = await checkIfFieldExists('email', input.email);

                    if (emailExists) {
                        setErrorMessage('Email is already in use. Please choose another Company ID.');
                        console.log(errormessage);
                        console.log('Email exists?', emailExists);
                        console.log('Component Rendered! Company ID.');
                        return;
                    }
                    
                    

                    const userCredential = await createUserWithEmailAndPassword(
                        auth,
                        input.email,
                        input.password
                    );
                    const user = userCredential.user;
                    const uid = userCredential.user.uid;
    
                    let userData = {
                        uid: uid,
                        companyid: input.companyid,
                        email: input.email,
                        contactnumber: input.contactnumber,
                        firstname: input.firstname,
                        lastname: input.lastname,
                        birthdate: input.birthdate,
                        password: input.password,
                        confirmpassword: input.confirmpassword,
                        datecreated: serverTimestamp(),
                        role: 'Developer',
                        status: 'Active',
                      };
                    
                    // Upload avatar to storage
                    if (file) {
                        const storageRef = storage;
                        const fileRef = ref(storageRef, `avatars/${file.name}`);
                        await uploadBytes(fileRef, file); // You might need to import uploadBytes from 'firebase/storage'
                        console.log('File uploaded successfully!');
                                    
                        // Get the download URL
                        const url = await getDownloadURL(fileRef);
                        
                        // Add the avatar URL to the userData
                        userData = {
                        ...userData,
                        profilePicture: url,
                        };
                    }
                    
                    await addDoc(collection(db, 'users'), userData);
    
                    setInput({
                        uid: '',
                        companyid: '',
                        email: '',
                        contactnumber: '',
                        firstname: '',
                        lastname: '',
                        birthdate: null,
                        profilePicture: '',
                        password: '',
                        confirmpassword:'',
                        role: '',
                        status: ''
                    });
    
                    setAvatar(null);
    
                    console.log('Registration successful! User registered and data stored:', user, uid)
                    setErrorMessage("Registration successful! User registered and data stored.");

                    // Automatically log in the user after successful registration
                    const signInCredential = await signInWithEmailAndPassword(
                        auth,
                        input.email,
                        input.password
                    );
            
                    // Check if the user is successfully logged in
                    if (signInCredential.user) {
                        console.log('User logged in after registration:', signInCredential.user);
                        handleClose(); // Close the registration popup
                    }
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage(error.message);
        }
    };

    const checkIfFieldExists = async (fieldName, value) => {
        try {
          const q = query(collection(db, 'users'), where(fieldName, '==', value));
          const querySnapshot = await getDocs(q);
          const exists = querySnapshot.size > 0;
          
          console.log(`Checking if ${fieldName} (${value}) exists: ${exists}`);
          console.log('Data retrieved:', querySnapshot.docs.map(doc => doc.data()));
          
          return exists;
        } catch (error) {
          console.error(`Error checking if ${fieldName} exists:`, error);
          return false;
        }
      };
      
    const validKeyForPayment = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "-",
        "Backspace",
      ];

    return (
        <div className='sign-up-container'>
            <form onSubmit={submitHandler} autoComplete="off">
                <div className='component-title'>REGISTER NEW USER</div>

                {/* Profile Picture Module */}
                <div className='profile-picture-component'>
                    <Avatar
                        alt="Profile Picture"
                        src={avatar}
                        sx={{ width: 200, height: 200 }}
                        onClick = {() => document.getElementById('profilePicture').click()}
                    />
                    <input
                        type="file"
                        id="profilePicture"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={changeProfilePicture}
                    />
                </div>

                <div>
                    <div className='sign-up-left'>
                        <label>Company ID: </label>
                        <input
                            type='text'
                            placeholder='Company ID'
                            value={input.companyid}
                            onChange={(e) => inputHandler(e)}
                            name='companyid'
                            pattern="[0-9-]*"
                            title="Only numbers are allowed"
                            onKeyDown={(e) => {
                                if (!validKeyForPayment.includes(e.key)) {
                                  e.preventDefault();
                                }
                              }}                
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

                    <div className='sign-up-right'>
                        <label>Password:</label>
                        <input
                            autoComplete='off'
                            type='password'
                            placeholder='Password'
                            value={input.password}
                            onChange={(e) => inputHandler(e)}
                            name='password'
                        />
                    </div>
                    <div className='sign-up-right'>
                        <label>Confirm Password:</label>
                        <input
                            type='password'
                            placeholder='Confirm Password'
                            value={input.confirmpassword}
                            onChange={(e) => inputHandler(e)}
                            name='confirmpassword'
                        />
                    </div>
                </div>

                <div className='message-show'>
                    {errormessage}
                </div>
                
                <div className='register-cancel-container'>
                    <button id='register' type='submit'>
                        Register
                    </button>

                    <button id='cancel' onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Registration;
