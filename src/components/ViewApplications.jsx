import React,{useState, useEffect} from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase-config'
import Popup from './PopUp';
import AddApplications from './UserMng/AddApplications';

const ViewApplications = () => {
  const [showPopup, setShowPopup] = useState(false);
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

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='viewApplications'>
      
      <div className='box'>
        <div className="rectangle" />
      </div>
      
      <div className='appLabel'>
        <div id= 'new-line1'> 
          <label>
          APPLICATION NAME
          </label>
        </div>

        <div id= 'new-line'> 
          <label>
          Team Leader: 
          </label>
        </div>

        <div id= 'new-line'> 
          <label>
          Assign QA: 
          </label>
        </div>

        <div id= 'new-line2'> 
          <label>
          Description: 
          </label>
        </div>

        <div id= 'new-line3'> 
          <label>
          sampple rani
          </label>
        </div>

      </div>


        <div className='ticket-table'>
        <table className='dashboard-table'>
          <thead>
            <tr>
              <th
                onClick={() => requestSort('subject')} 
                id='table-head'
                className={getClassNamesFor('subject')}>
                Bug History
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
                onClick={togglePopup}>
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
            <Popup show={showPopup} handleClose={closePopup}>
          <AddApplications handleClose={closePopup}/>
        </Popup>

      </div>
  )
}

export default ViewApplications
