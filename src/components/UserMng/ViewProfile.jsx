import { Tab } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { onValue } from 'firebase/database';
import { SpaceBar } from '@mui/icons-material';

/* const profileId = '9JkZB1M1WL1Ad9LFRMhw' */
const ViewProfile = ({handleClose, profileId}) => {
  console.log('Received profile Id: ', profileId);
  const [profileData, setProfileData] = useState(null);

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
      } catch (error) {
        console.error('Error fetching Profile data:', error);
      }
    };

    fetchProfileData();
  }, [profileId]);

  if (!profileData) {
    return <div>Loading...</div>;
  }
  const handleCancel = () => {
    handleClose();
  };

  return (
    <div className='viewProfile'>
          {profileData.id}
          <div>
          <button className='button' id='cancel'>
              <div id='text' onClick={handleCancel}> Close dapat ni png, same naa sa figma</div>
            </button>
          </div>
        <div className='box'>
            <div className="rectangle" />
          </div>
          
          <div className='appLabel'>
            <div id= 'new-line1'> 
              <label>
              {profileData.firstname} {profileData.lastname}
              </label>
            </div>

            <div id= 'new-line'> 
              <label>
              {profileData.companyid}
              </label>
            </div>

            <div id= 'new-line'> 
              <label>
              {profileData.email}
              </label>
            </div>

            <div id= 'new-line2'> 
              <label>
              {profileData.status}
              </label>
            </div>

            <div id= 'new-line3'> 
              <label>
              Assignments:
              </label>
            </div>

            <div id= 'new-line4'> 
              <label>
              Application 1 <Tab></Tab> <Tab></Tab>  Team Leader 1
              </label>
            </div>

            <div id= 'new-line4'> 
              <label>
              Application 2 <Tab></Tab> <Tab></Tab>  Team Leader 2
              </label>
            </div>
          </div>
      
    </div>
  )
}

export default ViewProfile
