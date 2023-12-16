import { Tab } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { onValue } from 'firebase/database';
import CancelIcon from '@mui/icons-material/Cancel';
import { Avatar } from '@mui/material';
import ViewApplications from '../ViewApplications';
import Popup from '../PopUp';
import Popup2 from '../PopUp-copy'
import EditProfile from '../UserMng/EditProfile'

/* const profileId = '9JkZB1M1WL1Ad9LFRMhw' */
const ViewProfile = ({handleClose, profileId, userUID}) => {
  console.log('Received profile Id: ', profileId);
  console.log('Received user UID: ', userUID);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [applicationData, setApplicationData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!profileId) {
          console.log('Profile ID is missing.');
          return;
        }

        const profileRef = doc(db, 'users', profileId);
        const profileDoc = await getDoc(profileRef);

        if (profileDoc.exists()) {
          console.log('Profile Data:', profileDoc.data());
          setProfileData({ id: profileDoc.id, ...profileDoc.data() });
        } else {
          console.log('Profile not found');
        }

        if (profileDoc.data().role === "Developer") {
          const appQuery = query(collection(db, 'applications'), where('teammembers', 'array-contains', profileDoc.data().uid))
          const qaDoc = await getDocs(appQuery);
        
          // Create an array to store application data
          const applications = [];

          // Iterate through the documents in the QuerySnapshot
          qaDoc.forEach((doc) => {
            // Log retrieved Developer Doc ID and Data
            console.log("Retrieved Developer Doc ID: ", doc.id);
            console.log("Retrieved Developer Doc Data: ", doc.data());

            // Add application data to the array
            applications.push({ id: doc.id, ...doc.data() });
          });

          // Update the state with the application data
          setApplicationData(applications);
          console.log("applicationData: ", applicationData);
        }

        if (profileDoc.data().role === "Quality Assurance") {
          const appQuery = query(collection(db, 'applications'), where('assignedqa', '==', profileDoc.data().uid))
          const qaDoc = await getDocs(appQuery);
        
          // Create an array to store application data
          const applications = [];

          // Iterate through the documents in the QuerySnapshot
          qaDoc.forEach((doc) => {
            // Log retrieved Developer Doc ID and Data
            console.log("Retrieved QA ID: ", doc.id);
            console.log("Retrieved QA Data: ", doc.data());

            // Add application data to the array
            applications.push({ id: doc.id, ...doc.data() });
          });

          // Update the state with the application data
          setApplicationData(applications);
          console.log("applicationData: ", applicationData);
        }
        

      } catch (error) {
        console.error('Error fetching Profile data:', error);
      }
    };

    fetchProfileData();
  }, [profileId]);

  function formatDateFromTimestamp(timestampSeconds) {
    // Convert seconds to milliseconds
    const timestampMilliseconds = timestampSeconds * 1000;
  
    // Create a new Date object
    const date = new Date(timestampMilliseconds);
  
    // Format the date as MM/DD/YYYY
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  
    return formattedDate;
  }
  
  if (!profileData) {
    return <div>Loading...</div>;
  }
  const handleCancel = () => {
    handleClose();
  };

  const togglePopup = (content, ticketId) => {
    setPopupContent({content, ticketId});
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  console.log("Profile Data: ", profileData)
  console.log("Application Data: ", applicationData)
  if (!profileData || applicationData === null) {
    return <div>Loading...</div>;
  }
  return (
    <div className='viewProfile'>
      <div className='header'>
        <div className='profile-picture'>
          <Avatar
            alt={profileData.lastname}
            sx={{
              width: 200,
              height: 200,
            }}
            src={profileData.profilePicture}
          />
          <div id={profileData.status === 'Active' ? 'active' : 'inactive' }>
              {profileData.status}
          </div>
        </div>
        
        <div className='appLabel'>
          <div id= 'employee-name'>
              {profileData.lastname}, <div id='firstname'>{profileData.firstname}</div>
          </div>

          <div id= 'company-id'>
            {profileData.companyid}, {profileData.role}
          </div>

          <div id= 'email'> 
            <label>
            {profileData.email}
            </label>
          </div>
          <div id='contact-number'>
            Contact Number: {profileData.contactnumber}
          </div>
          <div id='birthdate'>
            Birthdate: {formatDateFromTimestamp(profileData.birthdate.seconds)}
          </div>
          <div id='creation'>
            Since {formatDateFromTimestamp(profileData.datecreated.seconds)}
          </div>
        </div>
      </div>

      <div id='label'>
          Assignments:
      </div>

      <div className= 'assignment-area'> 
        

        <div className='profile-applications-table'>
          <table className='dashboard-table'>
            <thead>
              <tr>
                <th>
                  Application
                </th>
                <th>
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {applicationData.map((row) => (
                <tr
                  key={row.id} 
                  id='rows'
                  onClick={() => togglePopup(<ViewApplications handleClose={closePopup} appId={row.id}/>)}>
                  <td>{row.applicationname}</td>
                  <td>{profileData.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

            


          <div className='formbuttons'>
            {(profileData.uid === sessionStorage.getItem('uid') || sessionStorage.getItem('role') === "Admin") && (
            <button className='edit-changes' onClick={() => togglePopup(<EditProfile handleClose={closePopup} profileId={profileId}/>)}>
              Edit Profile
            </button>)}
            <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Close </div>
            </button>
        </div> 

        <Popup show={showPopup} handleClose={closePopup}>
          {popupContent && popupContent.content}
        </Popup>

    </div>
  )
}

export default ViewProfile
