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
          sx={{ width: 150, height:150 }}/>
      </div>
      <div className="UserInfo">
        {/* Add your name and email here */}
        <div id='name'>{props.name}</div>
        <div id='email'>{props.email}</div>
      </div>
    </div>
  );
}


function Sidebar(props) {
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    profilePicture: null
  });

  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const uid = sessionStorage.getItem('uid');

    const getUserData = async (uid) => {
      const q = query(collection(db, 'users'), where('uid', '==', uid));
      
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setUserData(doc.data());
        });
      } catch (error) {
        console.error('Error getting documents:', error);
      } finally {
        setLoading(false);
        setDataLoaded(true); // Set dataLoaded to true after data is loaded
      }
    };

    // Check if user data has already been loaded before making the API call
    if (loading && !dataLoaded) {
      getUserData(uid);
    }
  }, [loading, dataLoaded]); // Include dataLoaded in the dependency array


  const handleLogout = () => {
    // Clear the session storage and navigate to the login screen
    sessionStorage.removeItem('authenticated');
    sessionStorage.clear();
    props.onLogout(); // Call the onLogout function passed as a prop
  };

  const isItemActive = (link) => window.location.pathname === link;

  return (
    <div className='Sidebar'>
      <div>
        <UserProfile 
          profileSrc = {userData.profilePicture} 
          name = {userData.firstname + " " + userData.lastname} 
          email={userData.email}/>
      </div>
      <ul className='SidebarList'>
        {SidebarData.map((item, index) => (
            <li
              key={index}
              className='row'
              id={window.location.pathname == item.link ? "active" : ""}
              onClick={() => {
                window.location.pathname = item.link;
                setLoading(true); 
              }}
            >
              <div id='icon'>{isItemActive(item.link) ? item.activeIcon : item.icon}</div>
              <div id='title'>{item.title}</div>
            </li>
        ))}
      </ul>
      <div className='log-out-button'>
        <button onClick={handleLogout} className='logout-button'>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
