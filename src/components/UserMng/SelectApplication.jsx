import React, {useState, useEffect} from 'react'
import { db } from '../../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';

const SelectApplication = ({handleClose}) => {
    const handleCancel = () => {
        handleClose();
    };

    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState([]);

    useEffect(() => {
        // Fetch team leaders from Firestore
        const fetchApplications = async () => {
        try {
            const usersRef = collection(db, 'applications');
            const snapshot = await getDocs(usersRef);
    
            if (snapshot.empty) {
            console.log('No documents found in the application collection.');
            return;
            }
            
            const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(usersData);

            snapshot.forEach(doc => {
            console.log('Document ID:', doc.id);
            console.log('Document data:', doc.data());
            });
        } catch (error) {
            console.error('Error fetching team members:', error);
        }
        };
    
        fetchApplications();
    }, []);

    const handleSubmit = async () => {
        try {
          if (selectedApplication) {
            console.log('Selected Application:', selectedApplication);
            handleClose(selectedApplication); // Pass the user data to handleClose
          } else {
            console.log('Error fetching user details.');
          }
        } catch (error) {
          console.error('Error in handleSubmit:', error);
        }
      };

  return (
    <div>
      Select Application:

      {applications.map(user => (
        <div key={user.id} id='list'>
          <input
            type="radio"
            id={user.id}
            name="selectedApplication"
            value={user.id}
            checked={selectedApplication === user}
            onChange={() => setSelectedApplication(user)}
          />
          <label htmlFor={user.id}>{user.applicationname || 'Error retrieving application name'}</label>
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

export default SelectApplication
