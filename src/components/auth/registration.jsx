import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';


const Registration = () => {
    const [selectedDate, setSelectedDate] = useState(null); // Provide an initial value

    const [profilePicture, setProfilePicture] = useState(null);

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
        setProfilePicture(file);
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
                    />
                </div>
                
                <div className='sign-up-left'>
                    <label>Email: </label>
                    <input
                        type="email" 
                        placeholder="Email" 
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
                        selected={selectedDate}
                        onChange={date => setSelectedDate(date)}
                        dateFormat="yyyy/MM/dd" 
                        placeholderText='Birthdate'
                    />
                </div>

            </div>

        <br/>
        <div className='register-cancel-container'>
            <button id='register'>
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
