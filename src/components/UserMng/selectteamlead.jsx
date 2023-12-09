import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

const Selectteamlead = ({handleClose}) => {
  const handleCancel = () => {
    handleClose();
  };

  const [teamLeaders, setTeamLeaders] = useState([]);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);

  useEffect(() => {
    // Fetch team leaders from Firestore
    const fetchTeamLeaders = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'Team Leader'));
        const snapshot = await getDocs(q);
  
        if (snapshot.empty) {
          console.log('No documents found in the users collection.');
          return;
        }
        
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeamLeaders(usersData);

        snapshot.forEach(doc => {
          console.log('Document ID:', doc.id);
          console.log('Document data:', doc.data());
        });
      } catch (error) {
        console.error('Error fetching team leaders:', error);
      }
    };
  
    fetchTeamLeaders();
  }, []);

  const handleSubmit = async () => {
    try {
      if (selectedTeamLead) {
        console.log('Selected Team Lead:', selectedTeamLead);
        handleClose(selectedTeamLead); // Pass the user data to handleClose
      } else {
        console.log('Error fetching user details.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };
  
  return (
    <div className='selection'>
      Select Team Leader:

      {teamLeaders.map(user => (
        <div key={user.id} id='list'>
          <input
            type="radio"
            id={user.id}
            name="selectedTeamLead"
            value={user.id}
            checked={selectedTeamLead === user}
            onChange={() => setSelectedTeamLead(user)}
          />
          <label htmlFor={user.id}>{user.lastname + ', ' + user.firstname || 'Error retrieving name'}</label>
        </div>
      ))}

      <div className='formbuttons'>
          <button className='submit' onClick={handleSubmit}>
            Submit
          </button>
          <button className='cancel' id='text' onClick={handleCancel}>
              <div id='text' > Cancel </div>
            </button>
        </div> 
    </div>
  )
}

export default Selectteamlead
