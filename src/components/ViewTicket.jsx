import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import EditTicket from './EditTicket';
import Popup from './PopUp';

const ViewTicket = ({handleClose, ticketId}) => {
  console.log('Received ticket Id: ', ticketId);
  const [ticketData, setTicketData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        if (!ticketId) {
          console.log('Ticket ID is missing.');
          return;
        }

        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketDoc = await getDoc(ticketRef);

        if (ticketDoc.exists()) {
          console.log('Ticket Data:', ticketDoc.data());
          setTicketData({ id: ticketDoc.id, ...ticketDoc.data() });
        } else {
          console.log('Ticket not found');
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    };

    fetchTicketData();
  }, [ticketId]);

  if (!ticketData) {
    return <div>Loading...</div>;
  }
  const handleCancel = () => {
    handleClose();
  };

  const togglePopup = (content, ticketId, userId) => {
    setPopupContent({content, ticketId, userId})
    setShowPopup(!showPopup);
    
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  // Function to extract filename from a URL
  const getFilenameFromURL = (url) => {
    const decodedURL = decodeURIComponent(url);
    const pathSegments = decodedURL.split('/');
    let filenameWithQuery = pathSegments[pathSegments.length - 1];

    // Remove query parameters if present
    const filenameWithoutQuery = filenameWithQuery.split('?')[0];

    return filenameWithoutQuery;
  };

  return (
    <div className='ViewTicket'>
      <h2>Ticket #{ticketData.id}</h2>
      <p>Application: 
        <c> {ticketData.application} </c> </p>
      <p>Subject: 
        <c> {ticketData.subject} </c></p>
      <p>Assignee: 
        <c> {ticketData.assignDev}</c> </p>
      <p>Description:
        <c> {ticketData.description}</c></p>
      <p>Severity: 
        <c> {ticketData.severity}</c></p>
      <p>Status: 
        <c> {ticketData.status}</c></p>
      <p>Type: 
        <c> {ticketData.type}</c></p>

      {ticketData.tags && Array.isArray(ticketData.tags) && ticketData.tags.length >  0 && (
        <div>
          <p>Tags:</p>
          <ul>
            {ticketData.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul>
        </div>
      )}

      {ticketData.attachments && ticketData.attachments.length > 0 && (
        <div>
          <p>Attachments:</p>
          <ul>
            {ticketData.attachments.map((attachment, index) => (
              <li key={index}>
                <a href={attachment} target="_blank" rel="noopener noreferrer">
                  {getFilenameFromURL(attachment)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

        <div className='formbuttons' style={{ textAlign: 'right' }}>
          <button className='button' id='close'>
            Change Status
          </button>
          <button className='button' id='edit' onClick={() => togglePopup(<EditTicket handleClose={closePopup} ticketId={ticketId} userId={sessionStorage.getItem('uid')}/>)}>
            <div id='text'>Edit</div>
          </button>
          <button className='button' id='cancel'>
              <div id='text' onClick={handleCancel}> Close </div>
            </button>
        </div> 

        <Popup show={showPopup} handleClose={closePopup}>
          {popupContent && popupContent.content}
        </Popup>
    </div>
  );
};

export default ViewTicket;
