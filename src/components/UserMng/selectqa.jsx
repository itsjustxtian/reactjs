import React, { useEffect, useState } from 'react'
import { db } from '../../config/firebase-config';
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";

const Selectqa = ({handleClose}) => {
  const handleCancel = () => {
    handleClose();
  };

  const [qas, setQas] = useState([]);
  const [selectedQa, setSelectedQa] = useState(null);

  useEffect(() => {
    // Fetch team leaders from Firestore
    const fetchQAs = async () => {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'Quality Assurance'));
        const snapshot = await getDocs(q);
  
        if (snapshot.empty) {
          console.log('No documents found in the users collection.');
          return;
        }
        
        const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setQas(usersData);

        snapshot.forEach(doc => {
          console.log('Document ID:', doc.id);
          console.log('Document data:', doc.data());
        });
      } catch (error) {
        console.error('Error fetching quality assurance personnel:', error);
      }
    };
  
    fetchQAs();
  }, []);

  const handleSubmit = async () => {
    try {
      if (selectedQa) {
        console.log('Selected Quality Assurance Personnel:', selectedQa);
        handleClose(selectedQa); // Pass the user data to handleClose
      } else {
        console.log('Error fetching user details.');
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
    }
  };

  return (
    <div className='selection'>
      Select Quality Assurance Officer:

      {qas.map(user => (
        <div key={user.id} id='list'>
          <input
            type="radio"
            id={user.id}
            name="selectedQa"
            value={user.id}
            checked={selectedQa === user}
            onChange={() => setSelectedQa(user)}
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

export default Selectqa
