// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { query, collection, doc, getDoc, updateDoc, getDocs, where, onSnapshot } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Popup from './PopUp';
import CreateTicket from './CreateTicket';
import Viewticket from './ViewTicket'
import ClearIcon from '@mui/icons-material/Clear';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');

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
    /*const fetchData = async () => {
      try {
        const uid = sessionStorage.getItem('uid');
        await getUserData(uid);
    
        const role = sessionStorage.getItem('role');
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
    
        const ticketsQuery = query(collection(db, 'tickets'), where('application', 'in', applicationIds));
        const ticketsSnapshot = await getDocs(ticketsQuery);
    
        const updatedData = await Promise.all(
          ticketsSnapshot.docs.map(async (doc) => {
            const data = doc.data();
            const applicationName = await getApplicationName(data.application);
    
            const isLapsed = isTurnaroundTimeLapsed(data.turnaroundtime);
            const status = isLapsed ? 'Lapsed' : data.status;
    
            if (isLapsed && data.status !== 'Lapsed') {
              const ticketDocRef = doc(db, 'tickets', doc.id);
              await updateDoc(ticketDocRef, { status: 'Lapsed' });
            }
    
            return { id: doc.id, ...data, application: applicationName, status };
          })
        );
    
        setData(updatedData);
        console.log(updatedData);
    
        const unsubscribe = onSnapshot(collection(db, 'tickets'), (snapshot) => {
          const realTimeUpdatedData = Promise.all(
            snapshot.docs.map(async (doc) => {
              const data = doc.data();
              const applicationName = await getApplicationName(data.application);
    
              const isLapsed = isTurnaroundTimeLapsed(data.turnaroundtime);
              const status = isLapsed ? 'Lapsed' : data.status;
    
              if (isLapsed && data.status !== 'Lapsed') {
                const ticketDocRef = doc(db, 'tickets', doc.id);
                await updateDoc(ticketDocRef, { status: 'Lapsed' });
              }
    
              return { id: doc.id, ...data, application: applicationName, status };
            })
          );
    
          realTimeUpdatedData.then((resolvedData) => {
            setData(resolvedData);
            console.log('Real-time update:', resolvedData);
          });
        });
    
        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };*/

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
    console.log('Sorting by:', key, 'Direction:', direction);
    setSortConfig({ key, direction });
  };
  

  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  /*const sortedData = () => {
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
  };*/

  /*const sortedData = () => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const valueA = sortConfig.key === 'turnaroundtime' ? getTurnaroundTimestamp(a.turnaroundtime) : a[sortConfig.key];
        const valueB = sortConfig.key === 'turnaroundtime' ? getTurnaroundTimestamp(b.turnaroundtime) : b[sortConfig.key];
  
        const isLapsedA = isTurnaroundTimeLapsed(a.turnaroundtime);
        const isLapsedB = isTurnaroundTimeLapsed(b.turnaroundtime);
  
        if (a.status === 'Resolved' && b.status !== 'Resolved') {
          return 1;
        } else if (a.status !== 'Resolved' && b.status === 'Resolved') {
          return -1;
        } else if (isLapsedA && !isLapsedB) {
          return 1;
        } else if (!isLapsedA && isLapsedB) {
          return -1;
        } else {
          return sortConfig.direction === 'ascending' ? valueA - valueB : valueB - valueA;
        }
      });
    }
    return sortableData;
  };*/
 
  const sortedData = () => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const valueA = sortConfig.key === 'turnaroundtime' ? getTurnaroundTimestamp(a.turnaroundtime) : a[sortConfig.key];
        const valueB = sortConfig.key === 'turnaroundtime' ? getTurnaroundTimestamp(b.turnaroundtime) : b[sortConfig.key];
  
        const isLapsedA = isTurnaroundTimeLapsed(a.turnaroundtime);
        const isLapsedB = isTurnaroundTimeLapsed(b.turnaroundtime);
  
        if (a.status === 'Resolved' && b.status !== 'Resolved') {
          return 1;
        } else if (a.status !== 'Resolved' && b.status === 'Resolved') {
          return -1;
        } else if (isLapsedA && !isLapsedB) {
          return 1;
        } else if (!isLapsedA && isLapsedB) {
          return -1;
        } else {
          // Handle undefined values before calling localeCompare
          const compareResult = valueA && valueB ? valueA.toString().localeCompare(valueB.toString()) : 0;
  
          return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
        }
      });
    }
    return sortableData;
  };
  
  

  const getTurnaroundTimestamp = (turnaroundtime) => {
    return turnaroundtime?.seconds || 0;
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

  const isTurnaroundTimeLapsed = (turnaroundtime) => {
    const currentTimestamp = new Date().getTime();
    const turnaroundTimestamp = turnaroundtime.seconds * 1000 + Math.floor(turnaroundtime.nanoseconds / 1e6);
  
    return currentTimestamp > turnaroundTimestamp;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  /*const filteredData = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const sortedFilteredData = sortedData().filter((row) =>
      Object.values(row).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedTerm)
      )
    );
  
    // Custom sorting for filtered data based on turnaround time
    sortedFilteredData.sort((a, b) => {
      const timeA = a.turnaroundtime?.seconds || 0;
      const timeB = b.turnaroundtime?.seconds || 0;
  
      const isLapsedA = isTurnaroundTimeLapsed(a.turnaroundtime);
      const isLapsedB = isTurnaroundTimeLapsed(b.turnaroundtime);
  
      if (isLapsedA && !isLapsedB) {
        return 1;
      } else if (!isLapsedA && isLapsedB) {
        return -1;
      } else {
        return timeA - timeB;
      }
    });
  
    return sortedFilteredData;
  };*/
  
  /*const filteredData = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const sortedFilteredData = sortedData().filter((row) =>
      Object.values(row).some(
        (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedTerm)
      )
    );
  
    // Custom sorting for filtered data based on turnaround time
    sortedFilteredData.sort((a, b) => {
      if (sortConfig.key === 'turnaroundtime') {
        const timeA = a.turnaroundtime?.seconds || 0;
        const timeB = b.turnaroundtime?.seconds || 0;
  
        return sortConfig.direction === 'ascending' ? timeA - timeB : timeB - timeA;
      } else {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
  
        return sortConfig.direction === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
    });
  
    return sortedFilteredData;
  };*/
  
  const filteredData = () => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const sortedFilteredData = sortedData().filter((row) =>
      Object.values(row).some(
        (value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(lowercasedTerm);
          } else if (value instanceof Date) {
            // If the value is a Date, convert it to a string before comparison
            return value.toLocaleString().toLowerCase().includes(lowercasedTerm);
          } else {
            return false;
          }
        }
      )
    );
  
    // Custom sorting for filtered data based on turnaround time
    sortedFilteredData.sort((a, b) => {
      if (sortConfig.key === 'turnaroundtime') {
        const timeA = a.turnaroundtime?.seconds || 0;
        const timeB = b.turnaroundtime?.seconds || 0;
  
        return sortConfig.direction === 'ascending' ? timeA - timeB : timeB - timeA;
      } else {
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];
  
        // Handle undefined values before calling localeCompare
        const compareResult = valueA && valueB ? valueA.toString().localeCompare(valueB.toString()) : 0;
  
        return sortConfig.direction === 'ascending' ? compareResult : -compareResult;
      }
    });
  
    return sortedFilteredData;
  };
  

  return (
    <div className='dashboard'>
      <div className='component-title'>
        <CollectionsBookmarkIcon sx={{ fontSize: 60 }} style={{ marginRight: '10px' }}/>
          Dashboard 
        <CollectionsBookmarkIcon sx={{ fontSize: 60 }} style={{ marginLeft: '10px' }}/>
      </div>
      
      <div className='search-and-create'>
        <strong>Search: </strong>
        <input
            id='search-bar'
            placeholder='Search Subject/Application Name...'
            value={searchTerm}
            onChange={handleSearch}
          />

        <div className='buttoncontainer'>
          {sessionStorage.getItem('role') !== "Developer" && (<button className='rectangle' onClick={() => togglePopup(<CreateTicket handleClose={closePopup}/>)}>
            <NoteAddIcon/>
            <label>Create Ticket</label>
          </button>)}
        </div>
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
                Turnaround Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData().map((row) => (
                <tr
                  key={row.id}
                  id={isTurnaroundTimeLapsed(row.turnaroundtime) ? 'lapsed-row' : (row.status === 'Resolved' ? 'resolved-row' : 'rows')}
                  onClick={() => togglePopup(<Viewticket handleClose={closePopup} ticketId={row.id}/>, row.id)}
                >                  
                  <td>{row.subject}</td>
                  <td>{row.application}</td>
                  <td>{row.severity}</td>
                  <td
                    id={
                      isTurnaroundTimeLapsed(row.turnaroundtime)
                      ? 'lapsed-ticket'
                      : row.status === 'Open'
                      ? 'open-ticket'
                      : row.status === 'In Progress'
                      ? 'in-progress-ticket'
                      : row.status === 'Closed'
                      ? 'closed-ticket'
                      : row.status === 'Resolved'
                      ? 'resolved-row'
                      : 'rows'
                    }>
                      {isTurnaroundTimeLapsed(row.turnaroundtime)
                        ? 'Lapsed'
                        : row.status}
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
