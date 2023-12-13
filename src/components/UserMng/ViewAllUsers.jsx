import React from 'react'
import { db } from '../../config/firebase-config'
import { query, where, or, collection, getDocs } from 'firebase/firestore'
import { useState } from 'react'
import { useEffect } from 'react'
import Popup from '../PopUp'
import ViewProfile from './ViewProfile'
import EditProfile from './EditProfile'

const ViewAllUsers = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let applicationsRef;
  
        if (sessionStorage.getItem('role') !== "Admin") {
          // Query the applications collection for documents matching the user's UID
          const uid = sessionStorage.getItem('uid');
          const applicationsQuery = query(collection(db, 'applications'), 
            where('assignedqa', '==', uid),
            or(where('teamleader', '==', uid),
              where('teammembers', 'array-contains', uid)
            )
          );
          const applicationsSnapshot = await getDocs(applicationsQuery);
  
          const applicationIds = applicationsSnapshot.docs.map(doc => doc.id);
  
          // Get teamleader, assignedqa, and teammembers values
          const teamMembersData = applicationsSnapshot.docs.map(doc => ({
            teamleader: doc.data().teamleader,
            assignedqa: doc.data().assignedqa,
            teammembers: doc.data().teammembers
          }));
  
          // Flatten teammembers array
          const teamMembersArray = teamMembersData.reduce((acc, val) => acc.concat(val.teammembers), []);
  
          applicationsRef = query(collection(db, 'users'), 
            where('uid', 'in', [...teamMembersArray, ...applicationIds])
          );
        } else {
          // If the role is Admin, query all documents in the users collection
          applicationsRef = collection(db, 'users');
        }
        
        console.log("Applications returned: ", applicationsRef)
        const querySnapshot = await getDocs(applicationsRef);
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(documents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

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

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='View-All-Users'>
      <table className='View-All-Users-table'>
      <thead>
        <tr>
          <th 
            onClick={() => requestSort('companyid')} 
            id='table-head'
            className={getClassNamesFor('companyid')}>
              USER IDs
          </th>
          <th 
            onClick={() => requestSort('lastname')} 
            id='table-head'
            className={getClassNamesFor('lastname')}>
              Name
          </th>
          <th 
            onClick={() => requestSort('role')} 
            id='table-head'
            className={getClassNamesFor('role')}>
              Role
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
          <tr id='rows' key={row.id} onClick={togglePopup}>
            <td>{row.companyid}</td>
            <td>{row.lastname + ', ' + row.firstname}</td>
            <td>{row.role}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>

        <Popup show={showPopup} handleClose={closePopup}>
          <ViewProfile handleClose={closePopup}/>
        </Popup>

    </div>
  )
}
export default ViewAllUsers
