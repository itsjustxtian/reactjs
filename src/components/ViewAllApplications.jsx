import React from 'react'
import { db } from '../config/firebase-config'
import { collection, getDocs, query, where, onSnapshot} from "firebase/firestore"
import { useState } from 'react'
import { useEffect } from 'react'
import AddApplications from './UserMng/AddApplications'
import Popup from './PopUp'
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewApplications from './ViewApplications'

const ViewAllApplications = () => {
  const [data, setData] = useState([]);

  /*useEffect(() => {

    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'applications'));
        const documents = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
    
          // Convert teamleader id to name
          if (data.teamleader) {
            data.teamleader = await getTeamLeaderName(data.teamleader);
          } else {
            data.teamleader = "No Team Leader Identified.";
          }
    
          // Convert assignedqa id to name
          if (data.assignedqa) {
            data.assignedqa = await getAssignedQaName(data.assignedqa);
          } else {
            data.assignedqa = "No Quality Assurance Personnel Identified.";
          }
    
          return { id: doc.id, ...data };
        });
    
        // Wait for all promises to resolve
        const updatedDocuments = await Promise.all(documents);
    
        setData(updatedDocuments);
        console.log(updatedDocuments);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };    

    fetchData();
  }, []);*/

  useEffect(() => {
    const fetchData = () => {
      const q = query(collection(db, 'applications'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Convert teamleader id to name
          if (data.teamleader) {
            data.teamleader = await getTeamLeaderName(data.teamleader);
          } else {
            data.teamleader = "No Team Leader Identified.";
          }

          // Convert assignedqa id to name
          if (data.assignedqa) {
            data.assignedqa = await getAssignedQaName(data.assignedqa);
          } else {
            data.assignedqa = "No Quality Assurance Personnel Identified.";
          }

          return { id: doc.id, ...data };
        });

        Promise.all(documents).then((resolvedDocuments) => {
          setData(resolvedDocuments);
        });
      });

      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    };

    fetchData();
  }, []);

  const getTeamLeaderName = async (userid) => {
    try {
      if (!userid) {
        console.error('UID is empty or null');
        return null;
      }
  
      const usersRef = query(collection(db, 'users'), where('uid', '==', userid));
      const querySnapshot = await getDocs(usersRef);
  
      if (querySnapshot.docs.length > 0) {
        // Access the team leader name field from the first document in the result
        const teamLeaderName =
          querySnapshot.docs[0].data().lastname +
          ', ' +
          querySnapshot.docs[0].data().firstname; // Adjust the field name accordingly
        console.log('Team Leader Name:', teamLeaderName);
        return teamLeaderName;
      } else {
        console.log('No matching document for teamLeader:', userid);
        return null; // or handle the case where the document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching team leader name:', error);
      throw error; // or handle the error appropriately
    }
  }; 

  const getAssignedQaName = async (userid) => {
    try {
      if (!userid) {
        console.error('UID is empty or null');
        return null;
      }
  
      const usersRef = query(collection(db, 'users'), where('uid', '==', userid));
      const querySnapshot = await getDocs(usersRef);
  
      if (querySnapshot.docs.length > 0) {
        // Access the team leader name field from the first document in the result
        const teamLeaderName =
          querySnapshot.docs[0].data().lastname +
          ', ' +
          querySnapshot.docs[0].data().firstname; // Adjust the field name accordingly
        console.log('QA Name:', teamLeaderName);
        return teamLeaderName;
      } else {
        console.log('No matching document for QA:', userid);
        return null; // or handle the case where the document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching QA name:', error);
      throw error; // or handle the error appropriately
    }
  };   

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = (content) => {
    setPopupContent({content});
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const [popupContent, setPopupContent] = useState(null);


  return (
    <div className="View-All-Applications">
      <h1>REGISTERED APPLICATIONS</h1>
      <div className= 'buttoncontainer'>
        <button onClick={() => togglePopup(<AddApplications handleClose={closePopup}/>)}>
          New +
        </button>
      </div>
      

      <div >
        {data.map((application) => (
          <div key={application.id}>
           
            <div className='application-name' onClick={() => togglePopup(<ViewApplications appId={application.id} handleClose={closePopup}/>)}>
              {application.applicationname}
              <div className='icon'><VisibilityIcon onClick={<AddApplications/>}/></div>
            </div>
            <div className='team-leader'>
              <strong>Team Leader: </strong> {application.teamleader}
            </div>
            <div className='assigned-qa'>
              <strong>Assigned QA: </strong> {application.assignedqa}
            </div>
            <div className='space'/>
          </div>
        ))}
      </div>
      <Popup show={showPopup} handleClose={closePopup}>
        {popupContent && popupContent.content}
      </Popup>
    </div>
  )
}

export default ViewAllApplications;







