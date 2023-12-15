import React, {useState, useEffect} from 'react'
import { db } from '../../config/firebase-config';
import { and, query, where, collection, getDocs, or } from 'firebase/firestore';

const SelectApplication = ({handleClose}) => {
    const handleCancel = () => {
        handleClose();
    };

    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState([]);

    useEffect(() => {
      // Fetch applications from Firestore
      const fetchApplications = async () => {
        try {
          const uid = sessionStorage.getItem('uid');
          console.log('UID stored in selectApplication: ', uid)
          const role = sessionStorage.getItem('role');
          let applicationsRef;

          if (role === 'Admin') {
            // If the user has an 'Admin' role, return all documents
            applicationsRef = collection(db, 'applications');
          } else {
            // If not an 'Admin', include conditions based on 'assignedqa' and 'teamleader'
            applicationsRef = query(
              collection(db, 'applications'),
              or(
                where('assignedqa', '==', uid),
                where('teamleader', '==', uid)
              )
            );
          }

          const querySnapshot = await getDocs(applicationsRef);

          if (querySnapshot.empty) {
            console.log('No documents found in the application collection for the specified user.');
            return;
          }
    
          const applicationsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setApplications(applicationsData);
    
          querySnapshot.forEach(doc => {
            console.log('Document ID:', doc.id);
            console.log('Document data:', doc.data());
          });
        } catch (error) {
          console.error('Error fetching applications:', error);
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
    <div className='selection'>
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
