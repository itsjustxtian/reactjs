import React from 'react'
import { db } from '../config/firebase-config'
import { collection, getDocs} from "firebase/firestore"
import { useState } from 'react'
import { useEffect } from 'react'
import AddApplications from './UserMng/AddApplications'
import Popup from './PopUp'

const ViewAllApplications = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({key: null, direction: '' });

  useEffect(() => {

    //fetch applications 
    const fetchData = async () => {
      try {
        const querySnapshot= await getDocs(collection(db, 'applications'));
        const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setData(documents);
      } catch (error) {
        console.log('Error fetching data:', error);

      }
    };

    fetchData();
  }, []);

  const toggleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  const sortedData = () => {
    const sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        const comparison = a[sortConfig.key].localeCompare(b[sortConfig.key]);
        return sortConfig.direction === 'ascending' ? comparison : -comparison;
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
    <div className="View-All-Applications">
      <h1>REGISTERED APPLICATIONS</h1>
      <div class= 'buttoncontainer'>
        <button className= 'rectangle' id= 'text' onClick={togglePopup}>
          <div id= 'text'> New +</div>
          </button>
      </div>
      

      <div>
        {sortedData().map((application) => (
          <div key={application.id}>
           
            <div>
              <strong> </strong> {application.applicationname}
            </div>
            <div>
              <strong>Team Leader: </strong> {application.teamleader}
            </div>
            <div>
              <strong>Assigned QA: </strong> {application.assignedqa}
            </div>
            <hr/>
          </div>
        ))}
      </div>
      <Popup show={showPopup} handleClose={closePopup}>
          <AddApplications handleClose={closePopup}/>
        </Popup>
    </div>
  )
}

export default ViewAllApplications;







