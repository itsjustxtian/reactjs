import React, { useState } from 'react';

const ViewTicket = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample ticket details
  const ticketDetails = {
    application: 'Sample Application',
    subject: 'Sample Subject',
    assignedDeveloper: 'Dela Cruz, Juan',
    description: 'Example description',
    tags: ['Sample tag 1'],
    severity: 'Critical',
    type: 'Performance',
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={openModal}>Open Ticket</button>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-main">
            <h1>Application: {ticketDetails.application}</h1>
            <h2>Subject: {ticketDetails.subject}</h2>
            <p>Assigned Developer: {ticketDetails.assignedDeveloper}</p>
            <p>Description: {ticketDetails.description}</p>
            <p>Tags: {ticketDetails.tags.join(', ')}</p>
            <p>Severity/Priority: {ticketDetails.severity}</p>
            <p>Type: {ticketDetails.type}</p>

            {/* Add more ticket details as needed */}

            <button className="close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicket;