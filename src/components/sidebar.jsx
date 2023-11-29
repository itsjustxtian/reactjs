import React, {useState, useEffect} from 'react'
import '../App';
import {SidebarData} from './SidebarData'
import { Avatar } from '@mui/material';
import {db} from '../config/firebase-config';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

function UserProfile(props) {
    
  return (
    <div className="UserProfile">
      <div className='UserImage'>
      <Avatar 
        src={props.profileSrc} 
        className='ProfileImage'
        sx={{ width: 75, height: 75 }}/>
      </div>
      <div className="UserInfo">
        {/* Add your name and email here */}
        <h3>{props.name}</h3>
        <p id='email'>{props.email}</p>
      </div>
    </div>
  );
}


function Sidebar(props) {
  const [userData, setUserData] = useState({
    firstname: "Juan",
    lastname: "dela Cruz",
    email: "your.email@example.com",
    profilePicture: null
  });

  useEffect(() => {
    const uid = sessionStorage.getItem('uid');

  const getUserData = async (uid) => {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Retrieve only the 'email' and 'profilePicture' fields
          setUserData(doc.data());
        });
      } catch (error) {
        console.error('Error getting documents:', error);
      }
    };
    getUserData(uid);
  }, []);

  const handleLogout = () => {
    // Clear the session storage and navigate to the login screen
    sessionStorage.removeItem('authenticated');
    sessionStorage.clear();
    props.onLogout(); // Call the onLogout function passed as a prop
  };


  return (
    <div className='Sidebar'>
      <div>
        <UserProfile profileSrc = {userData.profilePicture} name = {userData.firstname + " " + userData.lastname} email={userData.email}/>
        
      </div>
      <ul className='SidebarList'>
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className='row'
              id = {window.location.pathname == val.link ? "active" : ""}
              onClick={() => {window.location.pathname = val.link
              }}
            >
              <div id='icon'>{val.icon}</div>{" "}
              <div id='title'>
                {val.title}
              </div>
            </li>
          )
        })}
      </ul>
      <button onClick={handleLogout} className='logout-button'>
        Logout
      </button>
      </div>
  )
}

export default Sidebar
