// Dashboard.jsx
import React, { useState } from 'react';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import Popup from './PopUp';
import CreateTicket from './CreateTicket';

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className='dashboard'>
      <div className='buttoncontainer'>
        <button className='rectangle' id='text' onClick={togglePopup}>
          <NoteAddIcon id='icon' />
          <div id='text'>Create New...</div>
        </button>

        
      </div>
      <Popup show={showPopup} handleClose={closePopup}>
          <CreateTicket />
        </Popup>
      <div className='space'></div>

      <div className='table'>
        <div className='rectangle'></div>
      </div>
    </div>
  );
};

export default Dashboard;
