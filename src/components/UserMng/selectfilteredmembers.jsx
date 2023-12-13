import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase-config';
import { doc, collection, query, where, getDocs, getDoc } from "firebase/firestore";

const Selectfilteredmembers = ({handleClose, appId}) => {
  const handleCancel = () => {
    handleClose();
  };

  const [teammembers, setTeamMembers] = useState([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);

  useEffect(() => {
    // Fetch team leaders from Firestore
    const fetchDevelopers = async () => {
      try {
        // (1) Get the document from the applications collection
        const appDocRef = doc(db, 'applications', appId);
        const appDocSnapshot = await getDoc(appDocRef);

        if (!appDocSnapshot.exists()) {
          console.log('No matching document for appId:', appId);
          return;
        }

        // (2) Get the array of values from the teammembers field
        const teamMembersArray = appDocSnapshot.data().teammembers;

        // (3) Query the users collection for documents whose uid field matches teammembers array
        const usersRef = collection(db, 'users');
        const teamMembersQuery = query(usersRef, where('uid', 'in', teamMembersArray));
        const teamMembersSnapshot = await getDocs(teamMembersQuery);

        // (4) Get the documents of those who match
        if (teamMembersSnapshot.empty) {
          console.log('No matching documents in the users collection.');
          return;
        }

        // Process the team members data
        const teamMembersData = teamMembersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeamMembers(teamMembersData);

        teamMembersSnapshot.forEach(doc => {
          console.log('Document ID:', doc.id);
          console.log('Document data:', doc.data());
        });
      } catch (error) {
        console.error('Error fetching team members:', error);
      }
    };
  
    fetchDevelopers();
  }, []);

  
  const handleCheckboxChange = (user) => {
    // Check if the user is already in the selectedTeamMembers array
    const isSelected = selectedTeamMembers.some((selectedUser) => selectedUser.id === user.id);

    // If the user is already selected, remove them from the array, otherwise add them
    if (isSelected) {
      const updatedTeamMembers = selectedTeamMembers.filter((selectedUser) => selectedUser.id !== user.id);
      setSelectedTeamMembers(updatedTeamMembers);
      console.log('Selected team members:', selectedTeamMembers)
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, user]);
      console.log('Selected team members:', selectedTeamMembers)
    }   
  }

  const handleSubmit = async () => {
    try {
      if (selectedTeamMembers) {
        console.log('Selected Team Lead:', selectedTeamMembers);
        handleClose(selectedTeamMembers); // Pass the user data to handleClose
      } else {
        console.log('Error fetching user details.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className='selection'>
      Select Members:

      {teammembers.map(user => (
        <div key={user.id} id='list'>
          <input
            type="checkbox"
            id={user.id}
            name="selectedTeamMembers"
            value={user.id}
            checked={selectedTeamMembers.some((selectedUser) => selectedUser.id === user.id)}
            onChange={() => handleCheckboxChange(user)}
          />
          <label htmlFor={user.id}>{user.lastname + ', ' + user.firstname || 'Error retrieving name'}</label>
        </div>
      ))}

      <div className='formbuttons'>
          <button className='submit' onClick={handleSubmit}>
            Submit
          </button>
          <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel </div>
            </button>
        </div> 
    </div>
  )
}

export default Selectfilteredmembers
