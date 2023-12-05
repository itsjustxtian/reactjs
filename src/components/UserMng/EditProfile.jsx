import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage, db } from '../../config/firebase-config';
import { doc, updateDoc, collection, query, where, getDocs, getDoc } from "firebase/firestore";

const EditProfile = ({ handleClose }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [file, setFile] = useState(null);

  const [userData, setUserData] = useState({
    companyid: '',
    role: '',
    firstName: '',
    lastName: '',
    birthdate: null,
    email: '',
    contactNumber: '',
  });

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const changeProfilePicture = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
    const storageRef = ref(storage, `avatars/${selectedFile.name}`);

    try {
      await uploadBytes(storageRef, selectedFile);
      console.log('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };

  const handleCancel = () => {
    handleClose();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      // Replace 'userUid' with the actual UID of the logged-in user
      const userUid = sessionStorage.getItem('uid');

      if (userUid) {
        const userDocRef = doc(db, 'users', userUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userDataFromFirestore = userDocSnap.data();

          // Update state with existing user data
          setUserData(userDataFromFirestore);
          setSelectedDate(userDataFromFirestore.birthdate.toDate()); // Assuming birthdate is a Firestore Timestamp
        }
      }
    };

    fetchUserData();
  }, []);
  
  const submitHandler = async (e) => {
    e.preventDefault();
  
    if (file) {
      const storageRef = storage;
      const fileRef = ref(storageRef, `avatars/${file.name}`);
      
      try {
        // Upload the file to storage
        await uploadBytes(fileRef, file);
        console.log('File uploaded successfully!');
                      
        // Get the download URL
        const url = await getDownloadURL(fileRef);
        
        // Add the avatar URL to the userData
        userData = {
          ...userData,
          profilePicture: url,
        };
  
      } catch (error) {
        console.error('Error uploading file:', error.message);
        // Handle the error (e.g., show an error message to the user)
        return;
      }
    }
  
    try {
      // Update the user document in the 'users' collection
      const usersCollection = collection(db, 'users');
      const userQuerySnapshot = await getDocs(usersCollection);
      const userDoc = userQuerySnapshot.docs.find(doc => doc.data().uid === sessionStorage.getItem('uid'));
  
      if (userDoc) {
        await updateDoc(userDoc.ref, userData);
        console.log('User document updated successfully!');
      } else {
        console.error('User document not found!');
        // Handle the case where the user document is not found
      }
    } catch (error) {
      console.error('Error updating user document:', error.message);
      // Handle the error (e.g., show an error message to the user)
    }
    const usersCollection = collection(db, 'users');

// Find the document based on the current email
const userQuery = query(usersCollection, where('email', '==', 'currentEmail@example.com'));
const userQuerySnapshot = await getDocs(userQuery);

if (!userQuerySnapshot.empty) {
  const userDoc = userQuerySnapshot.docs[0];
  const userId = userDoc.id;

  // Construct the user document reference
  const userDocRef = doc(usersCollection, userId);

  // Update multiple fields
  await updateDoc(userDocRef, {
    email: 'newEmail@example.com',
    firstname: 'NewFirstName',
    lastname: 'NewLastName',
    contactNumber: 'NewContactNumber'
    // Add more fields as needed
  });

  console.log('User information updated successfully!');
    } else {
        console.error('User document not found for the current email');
            }
  };

  return (
    <div className='sign-up-containerr'>
      <h1>Edit Profile</h1>
      
      <div>
        <div className='profile-picture-component'>
          <Avatar
            alt="Profile Picture"
            src={avatar}
            sx={{ width: 200, height: 200 }}
            onClick={() => document.getElementById('profilePicture').click()}
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
              // ... (other props)
            />
            <label>Role: </label>
            <input
              type="text"
              placeholder="Role"
              // ... (other props)
            />
          </div>

          <div className='sign-up-leftt'>
            <label>First Name: </label>
            <input
              type="text"
              placeholder="First name"
              value={userData.firstName}
              // ... (other props)
            />
            <label>Last Name: </label>
            <input
              type="text"
              placeholder="Last Name"
              // ... (other props)
            />
            <label>Birthdate: </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => handleDateChange(date)}
              dateFormat="yyyy/MM/dd"
              placeholderText='Birthdate'
              value={selectedDate}
            />
          </div>

          <div className='sign-up-leftt'>
            <label>Email: </label>
            <input
              type="email"
              placeholder="Email"
              // ... (other props)
            />
          </div>

          <div className='sign-up-leftt'>
            <label>Contact Number: </label>
            <input
              type="tel"
              pattern='[0-9]*'
              placeholder="Contact Number"
              // ... (other props)
            />
            <div className='formbuttons'>
              <button className='cancel' id='text' onClick={handleCancel}>
                <div id='text'> Cancel </div>
              </button>
              <button className='submit'> Submit </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;