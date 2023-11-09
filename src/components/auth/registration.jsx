import React, { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
        <div>
            <label>Company ID: </label>
            <input
                type="text" 
                placeholder="Enter your Company ID" 
            />

            <label>Username: </label>
            <input
                type="text" 
                placeholder="Enter your Username" 
            />

            <br/>
            <label>Email: </label>
            <input
                type="email" 
                placeholder="Enter your Email" 
            />

            <br/>
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

            <br/>
            <label>Date of Birth: </label>
            <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                dateFormat="yyyy/MM/dd" 
            />
        <br/>
        <label>Profile Picture:</label>
        {profilePicture ? (
          <img src={URL.createObjectURL(profilePicture)} alt="Profile" />
        ) : (
          <p>No profile picture selected</p>
        )}
        
        {/* Button to trigger file input */}
        <button onClick={handleFileInputChange}>
          Upload Profile Picture
        </button>
        
        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelected}
          style={{ display: 'none' }}
        />

        </div>
    );
}

export default Registration;
