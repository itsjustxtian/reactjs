import React from 'react';

const MessageModal = ({ message, onClose }) => {
  return (
    <div className="modal display-block">
      <div className="modal-main">
        <h2>Message Details</h2>
        <p><strong>Author:</strong> {message.author}</p>
        <p><strong>Date:</strong> {message.date}</p>
        <p><strong>Message:</strong> {message.message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default MessageModal;