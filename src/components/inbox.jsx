// Inbox.jsx
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import MessageModal from './MessageModal';
import './Inbox.css';

const Inbox = () => {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleOpenModal = (message) => {
    setSelectedMessage(message);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  // Dummy data for inbox messages
  const inboxMessages = [
    { id: 1, date: '2023-01-01', author: 'Christian Ocon', message: 'SAMPLE MESSAGE' },
    { id: 2, date: '2023-01-02', author: 'Roi Regis', message: 'Your ticket has been forwarded to the Developer.' },
    // Add more messages as needed
  ];

  return (
    <div className="inbox-container">
      <h1>Inbox</h1>
      {inboxMessages.map((message) => (
        <div key={message.id}>
          <div
            className="message-container"
            onClick={() => handleOpenModal(message)}
          >
            <div className="profile-picture">
              <div className='UserImage'>
                <Avatar src="/broken-image.jpg" className='ProfileImage' />
              </div>
            </div>
            <div className="message-box">
              <div className="message-content">
                <div className="message-author">{message.author}</div>
                <div className="message-text">{message.message}</div>
                <div className="message-date">{message.date}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {selectedMessage && (
        <MessageModal message={selectedMessage} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Inbox;