import React, { useState, useEffect } from 'react';
import { doc, collection, getDoc, getDocs, where, query, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import Popup from './PopUp';
import Viewticket from './ViewTicket'
import EditApplication from '../components/UserMng/EditApplication'
import VisibilityIcon from '@mui/icons-material/Visibility';

const ViewApplications = ({appId, handleClose}) => {
  console.log("appId:", appId)
  const handleCancel = () => {
    setData([]);
    setApplicationName(null);
    setTeamLeader(null);
    setAssignedqa(null);
    setDescription(null);
    setShowPopup(false); // Close the popup
    handleClose();
  };

  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [applicationName, setApplicationName] = useState(null);
  const [teamLeader, setTeamLeader] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
  const [assignedqa, setAssignedqa] = useState(null);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!appId) {
          console.log("appId not found: ", appId);
          return;
        }

        // Reset the state when a new application is selected
        setData([]);
        setApplicationName(null);
        setTeamLeader(null);
        setAssignedqa(null);
        setDescription(null);

        console.log("useEffect is running.")
        const appRef = doc(db, 'applications', appId)
        const appDoc = await getDoc(appRef)
        const ticketRef = query(collection(db, 'tickets'), where('application', '==', appId));
        const ticketDocs = await getDocs(ticketRef);
        const documents = ticketDocs.docs.map(async (doc) => {
          const data = doc.data()
          const applicationName = await getApplicationName(data.application);
          return { id: doc.id, ...data, application: applicationName };
        })

        // Wait for all promises to resolve
        const updatedDocuments = await Promise.all(documents);
  
        setData(updatedDocuments);
        console.log(updatedDocuments);

        if (appDoc.exists()) {
          console.log("Application Data: ", appDoc.data())
          
          if (!appDoc.data().teamleader) {
            setTeamLeader("No Team Leader Identified.")
          }
          else {
            setTeamLeader(await getTeamLeaderName(appDoc.data().teamleader))
          }

          if (!appDoc.data().applicationname) {
            setApplicationName("No Application Name Identified.")
          }
          else {
            setApplicationName(appDoc.data().applicationname)
          }

          if (!appDoc.data().assignedqa) {
            setAssignedqa("No Quality Assurance Personnel Identified.")
          }
          else {
            setAssignedqa(await getAssignedQaName(appDoc.data().assignedqa))
          }

          if (!appDoc.data().teammembers) {
            setTeamMembers(["No Team Members Identified."]);
          } else {
            const developerDocs = [];
          
            for (const developerId of appDoc.data().teammembers) {
              try {
                const devRef = query(collection(db, 'users'), where('uid', '==', developerId));
                const devSnapshot = await getDocs(devRef);
          
                if (!devSnapshot.empty) {
                  // Access the team member name field from the first document in the result
                  const teamMemberName =
                    devSnapshot.docs[0].data().lastname +
                    ', ' +
                    devSnapshot.docs[0].data().firstname; // Adjust the field name accordingly
                  developerDocs.push(teamMemberName);
                } else {
                  console.log("Team Member document not found for ID ", developerId);
                }
              } catch (error) {
                console.log("Error fetching Team Member data:", error);
              }
            }
          
            console.log("Developers: ", developerDocs);
            setTeamMembers(developerDocs);
          }


          if (!appDoc.data().description) {
            setDescription("No Description Identified.")
          }
          else {
            setDescription(appDoc.data().description)
          }


        }
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [appId]);

  
  const getApplicationName = async (appId) => {
    try {
      const docRef = doc(db, 'applications', appId);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Access the applicationname field from the document
        const applicationName = docSnap.data().applicationname;
        return applicationName;
      } else {
        console.log('No matching document for appId:', appId);
        return null; // or handle the case where the document doesn't exist
      }
    } catch (error) {
      console.error('Error fetching application name:', error);
      throw error; // or handle the error appropriately
    }
  }

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

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const sortedData = () => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };

  const togglePopup = (content, ticketId) => {
    setPopupContent({content, ticketId});
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  console.log('Popup content', popupContent);

  return (
    <div className='viewApplications'>
      
      <div className='header'>
        <div id= 'component-title'>
          {applicationName}
        </div>

        <div id= 'new-line'> 
          <div id='label'>
            Team Leader: <div id='value'>{teamLeader}</div>
          </div>
        </div>

        <div id= 'new-line'> 
          <div id='label'>
          Assigned QA: <div id='value'>{assignedqa}</div>
          </div>
        </div>

        <div id='new-line'>
          <div id='label'>
            Team Members:
            <ul id='value'>
              {teamMembers && teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <li key={index}>{member}</li>
                ))
              ) : (
                <li>No Team Members Identified.</li>
              )}
            </ul>
          </div>
        </div>


        <div id= 'new-line'> 
          <div id='label'>
            <strong>Description:</strong>
          </div>
        </div>

        <div id= 'new-line'> 
          <div id='descriptionnn'>
            {description}
          </div>
        </div>

      </div>

      <div className='ticket-history-area'>
      <div className='ticket-history'>
        <table className='dashboard-table'>
          <thead>
            <tr>
              <th
                onClick={() => requestSort('subject')} 
                id='table-head'
                className={getClassNamesFor('subject')}>
                Bugs
              </th>
              <th
                onClick={() => requestSort('status')} 
                id='table-head'
                className={getClassNamesFor('status')}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData().map((row) => (
              <tr
                id={
                  row.status === 'Resolved' ? 'resolved-row' : 'rows'}
                key={row.id} 
                onClick={() => togglePopup(<Viewticket handleClose={closePopup} ticketId={row.id}/>, row.id)}>
                  <td>{row.subject}</td>
                  <td
                    id={row.status === "Open"
                    ? 'open-ticket'
                    : row.status === "In progress"
                    ? 'in-progress-ticket'
                    : row.status === "Closed"
                    ? 'closed-ticket'
                    : row.status === "Resolved"
                    ? 'resolved-row'
                    : 'rows'}>
                      {row.status}
                  </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className='viewApplicationsbuttons'>
            <button className='edit-application' onClick={() => togglePopup(<EditApplication handleClose={closePopup} appId={appId}/>, closePopup, appId)}>
              Edit Profile
            </button>
          <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Close </div>
          </button>
        </div> 

      <Popup show={showPopup} handleClose={closePopup}>
        {popupContent && popupContent.content}
      </Popup>

    </div>
  );
};

export default ViewApplications;
