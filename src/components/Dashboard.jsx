// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase-config'
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Popup from './PopUp';
import CreateTicket from './CreateTicket';
import Viewticket from './ViewTicket'

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tickets'));
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

  const togglePopup = (content) => {
    setPopupContent(content);
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  console.log('Popup content', popupContent);

  return (
    <div className='dashboard'>
      <div className='buttoncontainer'>
        <button className='rectangle' onClick={() => togglePopup(<CreateTicket handleClose={closePopup}/>)}>
          <NoteAddIcon/>
          <label>Create New...</label>
        </button>
      </div>

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
                onClick={() => togglePopup(<Viewticket handleClose={closePopup}/>)}>
                  <td>{row.subject}</td>
                  <td>{row.application}</td>
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

      <Popup show={showPopup} handleClose={closePopup}>
        {popupContent}
      </Popup>

    </div>
  );
};

export default Dashboard;
