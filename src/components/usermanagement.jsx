import React from 'react'
import { db } from '../config/firebase-config'
import { query, where, or, collection, getDocs } from 'firebase/firestore'
import { useState } from 'react'
import { useEffect } from 'react'
import Popup from './PopUp'
import ViewProfile from './UserMng/ViewProfile'
import EditProfile from './UserMng/EditProfile'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';

const Usermanagement = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'status', direction: 'ascending' });
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let applicationsRef;
  
        if (sessionStorage.getItem('role') !== "Admin") {
          // Query the applications collection for documents matching the user's UID
          const uid = sessionStorage.getItem('uid');
          const applicationsQuery = query(collection(db, 'applications'),
            or(
              where('assignedqa', '==', uid),
              where('teamleader', '==', uid),
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
          const teamMembersArray = teamMembersData.reduce((acc, val) => {
            acc.push(...val.teammembers);
            acc.push(val.teamleader);
            acc.push(val.assignedqa);
            return acc;
          }, []);
  
          applicationsRef = query(collection(db, 'users'),
            where('uid', 'in', teamMembersArray)
          );
        } else {
          // If the role is Admin, query all documents in the users collection
          applicationsRef = collection(db, 'users');
        }
  
        const querySnapshot = await getDocs(applicationsRef);
        const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(documents);
        console.log("Applications returned: ", documents);
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

  const togglePopup = (content, profileId) => {
    setPopupContent({content, profileId})
    setShowPopup(!showPopup);
    
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='user-management'>
      <div className='component-title'> <PeopleAltIcon sx={{ fontSize: 60 }} style={{ marginRight: '10px' }}/> User Management <PeopleAltIcon sx={{ fontSize: 60 }} style={{ marginLeft: '10px' }}/></div>
      <div className='user-management-table-div'>
      <table className='user-management-table'>
      <thead>
        <tr>
          <th 
            onClick={() => requestSort('companyid')} 
            id='table-head'
            className={getClassNamesFor('companyid')}>
              Company ID
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
          <tr
            id={row.status === 'Inactive' ? 'inactive-rows' : 'rows'}
            key={row.id} 
            onClick={() => togglePopup(<ViewProfile handleClose={closePopup} profileId={row.id} userUID={sessionStorage.getItem('uid')}/>, row.id, sessionStorage.getItem('uid'))}>
              <td>{row.companyid}</td>
              <td>{row.lastname + ', ' + row.firstname}</td>
              <td>{row.role}</td>
              <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>

        <Popup show={showPopup} handleClose={closePopup}>
          {popupContent && popupContent.content}
        </Popup>

    </div>
  )
}

export default Usermanagement
