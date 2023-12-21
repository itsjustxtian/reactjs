import React, { useState, useEffect } from 'react';
import { or, collection, query, getDocs, onSnapshot, where } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import Popup from './PopUp';
import AddApplications from './UserMng/AddApplications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewApplications from './ViewApplications';
import WidgetsIcon from '@mui/icons-material/Widgets';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';

const ViewAllApplications = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = () => {
      const role = sessionStorage.getItem('role');

      let q;

      if (role !== 'Admin') {
        // If the user is not an Admin, query the applications collection based on user's UID
        const uid = sessionStorage.getItem('uid');
        q = query(collection(db, 'applications'), or(where('assignedqa', '==', uid), where('teamleader', '==', uid), where('teammembers', 'array-contains', uid)));
      } else {
        // If the user is an Admin, query all documents in the applications collection
        q = query(collection(db, 'applications'));
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const documents = querySnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Convert teamleader id to name
          if (data.teamleader) {
            data.teamleader = await getTeamLeaderName(data.teamleader);
          } else {
            data.teamleader = 'No Team Leader Identified.';
          }

          // Convert assignedqa id to name
          if (data.assignedqa) {
            data.assignedqa = await getAssignedQaName(data.assignedqa);
          } else {
            data.assignedqa = 'No Quality Assurance Personnel Identified.';
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterData = () => {
    const filteredData = data.filter((application) => {
      const applicationName = application.applicationname || ''; // Handle null case
      const teamLeader = application.teamleader || ''; // Handle null case
      const assignedQA = application.assignedqa || ''; // Handle null case
  
      return (
        applicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teamLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignedQA.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return filteredData;
  };

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

  const togglePopup = (content) => {
    setPopupContent({ content });
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
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
    const sortableData = filterData(); // Use filtered data for sorting
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const valueA = a[sortConfig.key] || ''; // Treat null as an empty string
        const valueB = b[sortConfig.key] || '';
  
        if (valueA < valueB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valueA > valueB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  };
 

  return (
    <div className="View-All-Applications">
      <div className='component-title'> <WidgetsIcon sx={{ fontSize: 60 }} style={{ marginRight: '10px' }}/> REGISTERED APPLICATIONS <WidgetsIcon sx={{ fontSize: 60 }} style={{ marginLeft: '10px' }}/></div>
      
      <div className='search-and-create'>
        <strong>Search: </strong>
        <input
            id='search-bar'
            placeholder='Search Application/Team Leader/QA...'
            value={searchTerm}
            onChange={handleSearch}
          />

        <div className='buttoncontainer'>
          {sessionStorage.getItem('role') !== "Developer" && (<button onClick={() => togglePopup(<AddApplications handleClose={closePopup}/>)}>
            <DashboardCustomizeIcon sx={{ fontSize: 30 }} style={{ marginRight: '10px' }}/> Add App
          </button>)}
        </div>
      </div>
      

      <div className='applications-table-div'>
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('applicationname')} className={getClassNamesFor('applicationname')}>
                Application Name
              </th>
              <th onClick={() => requestSort('teamleader')} className={getClassNamesFor('teamleader')}>
                Team Leader
              </th>
              <th onClick={() => requestSort('assignedqa')} className={getClassNamesFor('assignedqa')}>
                Assigned QA
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData().map((application) => (
              <tr key={application.id}>
                <td onClick={() => togglePopup(<ViewApplications appId={application.id} handleClose={closePopup}/>)}>
                  {application.applicationname}
                </td>
                <td>{application.teamleader}</td>
                <td>{application.assignedqa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Popup show={showPopup} handleClose={closePopup}>
        {popupContent && popupContent.content}
      </Popup>
    </div>
  );
};

export default ViewAllApplications;
