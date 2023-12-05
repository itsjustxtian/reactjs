import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';

const ViewTicket = () => {
  const ticketId = 'CtWfbsVs8q5SBgyu3WBF';
  const [ticketData, setTicketData] = useState(null);

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

  return (
    <div className='ViewTicket'>
      <h2>Ticket #{ticketData.id}</h2>
      <p>Application: {ticketData.application}</p>
      <p>Subject: {ticketData.subject}</p>
      <p>Assignee: {ticketData.assignDev}</p>
      <p>Description: {ticketData.description}</p>
      <p>Severity: {ticketData.severity}</p>
      <p>Status: {ticketData.status}</p>
      <p>Type: {ticketData.type}</p>

      {ticketData.tags && ticketData.tags.length > 0 && (
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
              <li key={index}>{attachment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ViewTicket;
