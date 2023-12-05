import React from 'react'
import { db } from '../config/firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { useState } from 'react'
import { useEffect } from 'react'
import Popup from './PopUp'
import ViewProfile from './UserMng/ViewProfile'
import EditProfile from './UserMng/EditProfile'

const Usermanagement = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(documents);
      } catch (error) {
        console.log('Error fetching data:', error);
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
    <div className='user-management'>
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
            onClick={togglePopup}>
              <td>{row.companyid}</td>
              <td>{row.lastname + ', ' + row.firstname}</td>
              <td>{row.role}</td>
              <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>

        <Popup show={showPopup} handleClose={closePopup}>
          <EditProfile handleClose={closePopup}/>
        </Popup>

    </div>
  )
}

export default Usermanagement
