import React from 'react'
import { db } from '../config/firebase-config'
import { collection, getDocs } from 'firebase/firestore'
import { useState } from 'react'
import { useEffect } from 'react'

const Usermanagement = () => {
  const [data, setData] = useState([]);

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

  return (
    <div className='user-management'>
      <table className='user-management-table'>
      <thead>
        <tr>
          <th>Company ID</th>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
       {data.map((row) => (
          <tr id='rows' key={row.id}>
            <td>{row.companyid}</td>
            <td>{row.lastname + ', ' + row.firstname}</td>
            <td>{row.role}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}

export default Usermanagement
