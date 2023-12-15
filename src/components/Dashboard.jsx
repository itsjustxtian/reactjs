// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { query, collection, doc, getDoc, getDocs, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Popup from './PopUp';
import CreateTicket from './CreateTicket';
import Viewticket from './ViewTicket'
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        await getUserData(uid);

        // Step (1): Query applications based on user role and uid
        const role = sessionStorage.getItem('role');
        //const uid = sessionStorage.getItem('uid');
        console.log("Role: ", role, "UID: ", uid)
        let applicationsQuery;

        if (role === 'Quality Assurance') {
          applicationsQuery = query(collection(db, 'applications'), where('assignedqa', '==', uid));
        } else if (role === 'Team Leader') {
          applicationsQuery = query(collection(db, 'applications'), where('teamleader', '==', uid));
        } else if (role === 'Developer') {
          applicationsQuery = query(collection(db, 'applications'), where('teammembers', 'array-contains', uid));
        } else if (role === 'Admin') {
          applicationsQuery = query(collection(db, 'applications'));
        }

        const applicationsSnapshot = await getDocs(applicationsQuery);
        const applicationIds = applicationsSnapshot.docs.map((doc) => doc.id);

        // Step (2): Query tickets based on the filtered applicationIds
        const ticketsQuery = query(collection(db, 'tickets'), where('application', 'in', applicationIds));
        const ticketsSnapshot = await getDocs(ticketsQuery);

        const documents = await Promise.all(
          ticketsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const applicationName = await getApplicationName(data.application);
            return { id: doc.id, ...data, application: applicationName };
          })
        );
  
        setData(documents);
        console.log(documents);
  
        // Set up real-time listener for the 'tickets' collection
        const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
          const updatedData = Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const applicationName = await getApplicationName(data.application);
              return { id: doc.id, ...data, application: applicationName };
            })
          );
  
          updatedData.then((resolvedData) => {
            setData(resolvedData);
            console.log('Real-time update:', resolvedData);
          });
        });
  
        return () => {
          // Unsubscribe when the component is unmounted
          unsubscribe();
        };
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const getUserData = async (uid) => {
    const q = query(collection(db, 'users'), where('uid', '==', uid));
  
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        sessionStorage.setItem('role', doc.data().role);
      });
    } catch (error) {
      console.error('Error getting documents:', error);
    }
  };
  
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

  const formatTurnaroundTime = (turnaroundtime) => {
    const timestampInMilliseconds = turnaroundtime.seconds * 1000 + Math.floor(turnaroundtime.nanoseconds / 1e6);
    const turnaroundTimeDate = new Date(timestampInMilliseconds);

    return turnaroundTimeDate.toLocaleDateString();
  };

  return (
    <div className='dashboard'>
      <div className='component-title'>
        <CollectionsBookmarkIcon sx={{ fontSize: 60 }} style={{ marginRight: '10px' }}/>
          Dashboard 
        <CollectionsBookmarkIcon sx={{ fontSize: 60 }} style={{ marginLeft: '10px' }}/>
      </div>
      
      <div className='buttoncontainer'>
        {sessionStorage.getItem('role') !== "Developer" && (<button className='rectangle' onClick={() => togglePopup(<CreateTicket handleClose={closePopup}/>)}>
          <NoteAddIcon/>
          <label>Create Ticket</label>
        </button>)}
      </div>

      <div className='center'>
      <div className='ticket-table'>
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
                onClick={() => requestSort('application')} 
                id='table-head'
                className={getClassNamesFor('application')}>
                Application
              </th>
              <th
                onClick={() => requestSort('severity')} 
                id='table-head'
                className={getClassNamesFor('severity')}>
                Severity
              </th>
              <th
                onClick={() => requestSort('status')} 
                id='table-head'
                className={getClassNamesFor('status')}>
                Status
              </th>
              <th
                onClick={() => requestSort('turnaroundtime')} 
                id='table-head'
                className={getClassNamesFor('turnaroundtime')}>
                T.A.T.
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
                  <td>{row.application}</td>
                  <td>{row.severity}</td>
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
                  <td>{formatTurnaroundTime(row.turnaroundtime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <Popup show={showPopup} handleClose={closePopup}>
        {popupContent && popupContent.content}
      </Popup>

    </div>
  );
};

export default Dashboard;
