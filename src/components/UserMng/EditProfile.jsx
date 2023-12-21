import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Avatar } from '@mui/material';
import { storage, db } from '../../config/firebase-config';
import { serverTimestamp, deleteDoc, updateDoc, doc, getDoc, collection } from 'firebase/firestore';
import { EmailAuthProvider, signInWithEmailAndPassword, reauthenticateWithCredential, getAuth, updateEmail, updatePassword } from 'firebase/auth';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { query, getDocs, where } from 'firebase/firestore';

const EditProfile = ({ handleClose, profileId }) => {
  const auth = getAuth();
  const [pwtoupdate, setPwToUpdate] = useState('');
  const [originalEmail, setOriginalEmail] = useState(''); // State to store the original email
  const [originalPassword, setOriginalPassword] = useState('');
  const [errormessage, setErrorMessage] = useState('');
  const [input, setInput] = useState({
    uid: '',
    companyid: '',
    email: '',
    contactnumber: '',
    firstname: '',
    lastname: '',
    birthdate: null,
    profilePicture: '',
    newpassword: '',
    password: '',
    confirmpassword: '',
    confirmnewpassword: '',
    role: '',
    status: '',
  });

  const [avatar, setAvatar] = useState(null); // Changed from 'profilePicture' to 'avatar' for consistency
  const [file, setFile] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [data, setData] = useState(false);


  const handleCancel = () => {
    handleClose();
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'users', profileId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setOriginalPassword(userData.password);

          // Create a new object without password and confirmpassword
          const { password, confirmpassword, ...userDataWithoutPassword } = userData;

          // Store the original email in the state
          setOriginalEmail(userData.email);
          console.log("Original Email and Password: ", originalEmail, originalPassword)

          setInput(userDataWithoutPassword);
          setData(userData);
          setAvatar(userData.profilePicture || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [profileId]);

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
        .slice(0, 11);

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
  };

  const dateHandler = (date) => {
    setInput((prevInput) => ({
      ...prevInput,
      birthdate: date,
    }));
  };

  const changeProfilePicture = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setAvatar(URL.createObjectURL(selectedFile));
  };

  /*const submitHandler = async (e) => {
    e.preventDefault();
  
    try {
      setErrorMessage('');
  
      // Fetch user data from the database
      const userRef = doc(db, 'users', profileId);
      const userDoc = await getDoc(userRef);
  
      if (!userDoc.exists()) {
        console.error('User not found in the database');
        return;
      }
  
      const userData = userDoc.data();
  
      // Check if the entered password matches the old password in the database
      if (input.password !== userData.password || input.confirmpassword !== userData.confirmpassword) {
        setErrorMessage('Incorrect Password. Changes will not be saved.');
        return;
      }
  
      // Check if the "New Password" fields match
      if (showNewPassword && input.newpassword.trim() !== input.confirmnewpassword.trim()) {
        setErrorMessage('New Password and Confirm New Password must match.');
        return;
      }
  
      // If the "New Password" field is not blank and the "New Password" button is clicked
      if (showNewPassword && input.newpassword.trim() !== '') {
        // If conditions are met, update the password and confirmpassword fields
        input.password = input.newpassword;
        input.confirmpassword = input.newpassword;
        // Clear the newpassword and confirmnewpassword fields to avoid storing them in the database
        input.newpassword = '';
        input.confirmnewpassword = '';
      } else {
        // If "New Password" is not being updated, ensure confirmpassword matches the old password
        input.confirmpassword = input.password;
      }
  
      const updatedUserData = {
        companyid: input.companyid,
        email: input.email,
        contactnumber: input.contactnumber,
        firstname: input.firstname,
        lastname: input.lastname,
        birthdate: input.birthdate,
        password: input.password, // Updated to use either the original or new password
        confirmpassword: input.confirmpassword,
        role: input.role,
        status: input.status,
      };
  
      // Upload avatar to storage
      if (file) {
        const storageRef = storage;
        const fileRef = ref(storageRef, `avatars/${file.name}`);
        await storage.uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        updatedUserData.profilePicture = url;
      }
  
      // Update user details in the database
      await updateDoc(doc(db, 'users', profileId), updatedUserData);
  
      console.log('User details updated successfully!');
      setErrorMessage('User details updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      setErrorMessage(error.message);
    }
  };*/

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage('');

      // Fetch user data from the database
      const userRef = doc(db, 'users', profileId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        console.error('User not found in the database');
        return;
      }

      const userData = userDoc.data();
      // Check if any required field is empty
      if (
        !input.companyid ||
        !input.email ||
        !input.contactnumber ||
        !input.firstname ||
        !input.lastname ||
        !input.birthdate
      ) {
        setErrorMessage('All fields are required to be filled.');
        return;
      }

      // Check if the company ID already exists for a different user
      const companyIdQuery = query(collection(db, 'users'), where('companyid', '==', input.companyid));
      const companyIdQuerySnapshot = await getDocs(companyIdQuery);

      if (!companyIdQuerySnapshot.empty) {
        const existingUser = companyIdQuerySnapshot.docs.find(doc => doc.id !== profileId && doc.data().companyid === input.companyid);
        if (existingUser) {
          setErrorMessage('Company ID already exists. Please choose a different one.');
          return;
        }
      }

      // Check if the email already exists for a different user
      const emailQuery = query(collection(db, 'users'), where('email', '==', input.email));
      const emailQuerySnapshot = await getDocs(emailQuery);

      if (!emailQuerySnapshot.empty) {
        const existingUser = emailQuerySnapshot.docs.find(doc => doc.id !== profileId && doc.data().email === input.email);
        if (existingUser) {
          setErrorMessage('Email already exists. Please choose a different one.');
          return;
        }
      }

      let updatedUserData = [];

      console.log("Role: ", sessionStorage.getItem('role'), "userData.uid: ", userData.uid, "sessionStorage.getItem('uid'): ", sessionStorage.getItem('uid'))

      if (sessionStorage.getItem('role') === 'Admin' && userData.uid !== sessionStorage.getItem('uid')) {
        //const adminUserRef = doc(db, 'users', sessionStorage.getItem('uid')); // Replace adminUid with the actual uid of the admin
        const adminUserQuery = query(collection(db, 'users'), where('uid', '==', sessionStorage.getItem('uid')))
        const adminUserQuerySnapshot = await getDocs(adminUserQuery);

        if (!adminUserQuerySnapshot.empty) {
          // Assuming there's only one document matching the query
          const adminUserData = adminUserQuerySnapshot.docs[0];
          const adminUserRef = doc(db, 'users', adminUserData.id);

          const adminUserDoc = await getDoc(adminUserRef);
          if (adminUserDoc.exists()) {
            const adminUserData = adminUserDoc.data();
            const adminPassword = adminUserData.password;

            // Verify the entered password against the admin's password
            if (input.password !== adminPassword) {
              setErrorMessage('Admin password verification failed. Changes will not be saved.');
              return;
            }}

        } else {
          console.error('Admin user not found in the database');
          return;
        }

        updatedUserData = {
          companyid: input.companyid,
          email: input.email,
          contactnumber: input.contactnumber,
          firstname: input.firstname,
          lastname: input.lastname,
          birthdate: input.birthdate,
          //password: input.password, // Updated to use either the original or new password
          //confirmpassword: input.confirmpassword,
          role: input.role,
          status: input.status,
        };
      } else {
        // Check if the entered password matches the old password in the database
        if (input.password !== userData.password || input.confirmpassword !== userData.confirmpassword) {
          setErrorMessage('Incorrect Password. Changes will not be saved.');
          return;
        }

        // Check if the "New Password" fields match
        if (showNewPassword && input.newpassword!== input.confirmnewpassword) {
          setErrorMessage('New Password and Confirm New Password must match.');
          return;
        }

        // If the "New Password" field is not blank and the "New Password" button is clicked
        if (showNewPassword && input.newpassword.trim() !== '') {
          // If conditions are met, update the password and confirmpassword fields
          input.password = input.newpassword;
          input.confirmpassword = input.newpassword;
          // Clear the newpassword and confirmnewpassword fields to avoid storing them in the database
          input.newpassword = '';
          input.confirmnewpassword = '';
        } else {
          // If "New Password" is not being updated, ensure confirmpassword matches the old password
          input.confirmpassword = input.password;
        }

        updatedUserData = {
          companyid: input.companyid,
          email: input.email,
          contactnumber: input.contactnumber,
          firstname: input.firstname,
          lastname: input.lastname,
          birthdate: input.birthdate,
          password: input.password, // Updated to use either the original or new password
          confirmpassword: input.confirmpassword,
          role: input.role,
          status: input.status,
        };
      }

      // Upload avatar to storage
      if (file) {
        const storageRef = storage;
        const fileRef = ref(storageRef, `avatars/${file.name}`);
        await storage.uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        updatedUserData.profilePicture = url;
      }

      console.log("updatedUserData: ", updatedUserData)
      // Update user details in the database
      await updateDoc(doc(db, 'users', profileId), updatedUserData);

      // Reauthenticate the user before updating sensitive information
      const credential = EmailAuthProvider.credential(auth.currentUser.email, originalPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update authentication credentials if new email is provided and it differs from the original email
      if (input.email !== originalEmail) {
        await updateEmail(auth.currentUser, input.email);
      }

      // Update authentication credentials if new password is provided
      if (input.newpassword) {
        await updatePassword(auth.currentUser, pwtoupdate);
      }

      console.log('Email:', auth.currentUser.email);
      console.log('New Password:', input.password);
      console.log('Original Password:', originalPassword);

      console.log('User details and authentication updated successfully!');
      setErrorMessage('User details and authentication updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      //setErrorMessage(error.message);
      console.log('Email:', auth.currentUser.email);
      console.log('Input Password:', input.password);
      console.log('Original Password:', originalPassword);
    }
  };



  const toggleNewPassword = () => {
    setShowNewPassword((prevShowNewPassword) => !prevShowNewPassword);
  };

  const validKeyForPayment = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '-',
    'Backspace',
  ];

  const deleteHandler = async () => {
    try {
      setErrorMessage('');

      if (!input.password || !input.confirmpassword){
        setErrorMessage("Input your password to confirm deletion.")
        return;
      }

      // Validation for non-admin users
      if (
        sessionStorage.getItem('uid') === profileId &&
        sessionStorage.getItem('role') !== 'Admin'
      ) {
        const userQuery = query(collection(db, 'users'), where('uid', '==', profileId));
        const userQuerySnapshot = await getDocs(userQuery);

        if (userQuerySnapshot.empty) {
          console.error('User not found in the database');
          setErrorMessage('User not found in the database');
          return;
        }

        const userData = userQuerySnapshot.docs[0].data();

        // Check if the entered password matches the password in the database
        if (input.password !== userData.password || input.confirmpassword !== userData.confirmpassword) {
          console.error('Incorrect Password. Deletion will not be performed.');
          setErrorMessage('Incorrect Password. Deletion will not be performed.');
          return;
        }
      }

      // Validation for admin users
      if (sessionStorage.getItem('role') === 'Admin') {
        const adminUserQuery = query(collection(db, 'users'), where('uid', '==', sessionStorage.getItem('uid')));
        const adminUserQuerySnapshot = await getDocs(adminUserQuery);

        if (adminUserQuerySnapshot.empty) {
          console.error('Admin user not found in the database');
          setErrorMessage('Admin user not found in the database');
          return;
        }

        const adminUserData = adminUserQuerySnapshot.docs[0].data();

        // Check if the entered password matches the admin's password
        if (input.password !== adminUserData.password || input.confirmpassword !== adminUserData.confirmpassword) {
          console.error('Admin password verification failed. Deletion will not be performed.');
          setErrorMessage('Admin password verification failed. Deletion will not be performed.');
          return;
        }
      }

      // Delete the user document with the given profileId
      await deleteDoc(doc(db, 'users', profileId));
      console.log('User deleted successfully!');
      setErrorMessage('User deleted successfully!');
      handleClose(); // Close the modal or navigate away after deletion
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(error.message);
    }
  };


  return (
    <div className='sign-up-container'>
      <div className='component-title'>Update User Details</div>
      
      <div>

        {/* Profile Picture Module */}
        <div className='profile-picture-component'>
          <Avatar
            alt='Profile Picture'
            src={avatar}
            sx={{ width: 200, height: 200 }}
            onClick={() => document.getElementById('profilePicture').click()}
          />
          <input
            type='file'
            id='profilePicture'
            accept='image/*'
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
              pattern='[0-9-]*'
              title='Only numbers are allowed'
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
              disabled={data.uid !== sessionStorage.getItem('uid')}
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
              selected={input.birthdate ? new Date(input.birthdate.seconds * 1000) : null}
              onChange={(date) => dateHandler(date)}
            />
          </div>

          {sessionStorage.getItem('role') === "Admin" && (
            <div className='new-line-select'>
              <label>Role:</label>
              <select
                value={input.role}  // Add this line to reflect the current value
                onChange={(e) => inputHandler(e)}
                name='role'
              >
                <option value={"Developer"}> Developer </option>
                <option value={"Quality Assurance"}> Quality Assurance </option>
                <option value={"Team Leader"}> Team Leader </option>
                <option value={"Admin"}> Admin </option>
              </select>
            </div>
          )}

          {sessionStorage.getItem('role') === "Admin" && (
            <div className='new-line-select'>
              <label>Status:</label>
              <select
                value={input.status}  // Add this line to reflect the current value
                onChange={(e) => inputHandler(e)}
                name='status'
              >
                <option value={"Active"}> Active </option>
                <option value={"Inactive"}> Inactive </option>
              </select>
            </div>
          )}

          <div className='passwords'>
            <div className='passwords-flex'>
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
          
          {showNewPassword && (
            <div className='passwords-flex'>
            <div className='sign-up-right'>
              <label>New Password:</label>
              <input
                autoComplete='off'
                type='password'
                placeholder='New Password'
                value={input.newpassword}
                onChange={(e) => inputHandler(e)}
                name='newpassword'
              />
            </div>
            <div className='sign-up-right'>
              <label>Confirm New Password:</label>
              <input
                autoComplete='off'
                type='password'
                placeholder='New Password'
                value={input.confirmnewpassword}
                onChange={(e) => inputHandler(e)}
                name='confirmnewpassword'
              />
            </div>
            </div>
          )}
          </div>
        </div>

        <div className='message-show'>{errormessage}</div>

        <div className='register-cancel-container'>
          { sessionStorage.getItem('uid') === data.uid && (<button id='cancel' onClick={toggleNewPassword}>
              New Password
          </button>)}
          
          <button id='register' type='submit' onClick={submitHandler}>
            Update
          </button>

          <button id='delete' onClick={deleteHandler}>
            Delete
          </button>
          
          <button id='cancel' onClick={handleCancel}>
            Cancel
          </button>
          </div></div>
        </div>
  );
};

export default EditProfile;
