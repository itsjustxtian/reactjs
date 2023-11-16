import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';


// Your Firebase configuration here
const firebaseConfig = {
  apiKey: "AIzaSyCRGvyQQPBjUmVL5InySmsRfulJ6eT4zmE",
  authDomain: "bughunter-e397c.firebaseapp.com",
  databaseURL: "https://bughunter-e397c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bughunter-e397c",
  storageBucket: "bughunter-e397c.appspot.com",
  messagingSenderId: "619778835660",
  appId: "1:619778835660:web:08339a4fd8fc3b79e86e69",
  measurementId: "G-LGK9LNEFKR"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const storage = getStorage(firebaseApp);


const Registration = () => {
    const fileInputRef = useRef(null);

    // Function to handle the file input change
    const handleFileInputChange = () => {
        fileInputRef.current.click();
    };

    // Function to handle the file input change
    const handleFileSelected  = (e) => {
        const file = e.target.files[0];
        // You can add validation for file type and size here if needed.
        // For now, we'll simply set the selected file as the profile picture.
        setProfilePicture((prevProfilePicture) => {
            // Ensure that the state is updated based on the previous state
            return file;
        });    
    };

    const [companyId, setCompanyId] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedDate, setSelectedDate] = useState(''); // Provide an initial value
    const [profilePicture, setProfilePicture] = useState('');

    const handleRegister = () => {
        // Get other input values
        const companyId = document.getElementById('companyId').value;
        const email = document.getElementById('email').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
    
        // Firebase storage reference
        const storageRef = firebase.storage().ref(`profilePictures/${profilePicture.name}`);
        
        // Upload profile picture to Firebase Storage
        const uploadTask = storageRef.put(profilePicture);
    
        // Handle successful upload
        uploadTask.on('state_changed', 
          (snapshot) => {
            // Progress monitoring
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            // Handle errors during upload
            console.error('Error uploading profile picture:', error);
          },
          () => {
            // Handle successful upload completion
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              // Create an entry in Firebase Database
              firebase.database().ref('users').push({
                companyId,
                email,
                contactNumber,
                firstName,
                lastName,
                profilePicture: downloadURL,
                dateOfBirth: selectedDate.toISOString(),
              });
            });
          }
        );
      };
    

    return (
        <div className='sign-up-container'>
            <h1 >Register New User</h1>

            {/*Profile Picture Module */}
        <div className='profile-picture-component'>
        {profilePicture ? (
        <Avatar 
            src={URL.createObjectURL(profilePicture)} 
            alt="Profile Picture" 
            sx={{width:200, height:200}}
            
            />
        ) : (
        <Avatar
            alt="Profile Picture"
            sx={{width: 200, height: 200}}
        />
        )}
        
        {/* Button to trigger file input */}
        <button 
            onClick={handleFileInputChange}
            className='buttontext'
            id='upload'
            >
        Upload
        </button>
        
        <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileSelected}
        style={{ display: 'none' }}
        />
        </div>

            <br/>
            <div>
                <div className='sign-up-left'>
                    <label>Company ID: </label>
                    <input
                        type="text" 
                        placeholder="Company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                    />
                </div>
                
                <div className='sign-up-left'>
                    <label>Email: </label>
                    <input
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label>Contact Number: </label>
                    <input
                        type="tel" 
                        pattern='[0-9]*'
                        placeholder="Contact Number"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
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
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd" 
                        placeholderText='Birthdate'
                    />
                </div>

            </div>

        <br/>
        <div className='register-cancel-container'>
            <button id='register' onClick={handleRegister}>
                Register
            </button>

            <button id='cancel'>
                Cancel
            </button>
        </div>

        </div>
    );
}

export default Registration;
