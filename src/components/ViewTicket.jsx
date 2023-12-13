import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { query, collection, where, getDocs, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import EditTicket from './EditTicket';
import Popup from './PopUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { addDays, format } from 'date-fns'; // Import the date-fns library for date formatting

const ViewTicket = ({handleClose, ticketId}) => {
  console.log('Received ticket Id: ', ticketId);
  const [ticketData, setTicketData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupContent, setPopupContent] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [applicationName, setApplicationName] = useState(null)
  const [developers, setDevelopers] = useState([])

  /*useEffect(() => {
    const fetchTicketData = async () => {
      try {
        if (!ticketId) {
          console.log('Ticket ID is missing.');
          return;
        }

        const ticketRef = doc(db, 'tickets', ticketId);
        const ticketDoc = await getDoc(ticketRef);

        if (ticketDoc.exists()) {
          setTicketData({ id: ticketDoc.id, ...ticketDoc.data() });

          if (!ticketDoc.data().application) {
            setApplicationName('No Application Identified.');
          } else {
            setApplicationName(await getApplicationName(ticketDoc.data().application));
          }

          if (!ticketDoc.data().assignDev) {
            setDevelopers(['No Developers Identified']);
          } else {
            const developerDocs = [];

            for (const developerId of ticketDoc.data().assignDev) {
              const devRef = query(collection(db, 'users'), where('uid', '==', developerId));
              const devSnapshot = await getDocs(devRef);
            
              if (!devSnapshot.empty) {
                const devData = devSnapshot.docs[0].data();
                developerDocs.push(devData.firstname + ' ' + devData.lastname);
              } else {
                console.log('Developer document not found for UID ', developerId);
              }
            }

            setDevelopers(developerDocs);
          }
        } else {
          console.log('Ticket not found');
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      } finally {
        
        setLoading(false);
      }
    };
// Set loading to false when the async operations are complete
        console.log("Application name: ", applicationName)
        console.log("Assigned Devs: ", developers)
    fetchTicketData();
  }, [ticketId]);*/

const getApplicationName = async (appId) => {
  try {
    const docRef = doc(db, 'applications', appId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // Access the applicationname field from the document
      const applicationName = docSnap.data().applicationname;
      return applicationName;
    } else {
      console.log('No matching document for appId:', appId);
      return null; // or handle the case where the document doesn't exist
    }
  } catch (error) {
    console.error('Error fetching application name:', error);
    throw error; // or handle the error appropriately
  }
}

useEffect(() => {
  const fetchTicketData = async () => {
    try {
      if (!ticketId) {
        console.log('Ticket ID is missing.');
        return;
      }

      const ticketRef = doc(db, 'tickets', ticketId);

      // Subscribe to real-time updates with onSnapshot
      const unsubscribe = onSnapshot(ticketRef, async (ticketDoc) => {
        try {
          if (ticketDoc.exists()) {
            setTicketData({ id: ticketDoc.id, ...ticketDoc.data() });

            if (!ticketDoc.data().application) {
              setApplicationName('No Application Identified.');
            } else {
              const appName = await getApplicationName(ticketDoc.data().application);
              setApplicationName(appName || 'No Application Identified.');
            }

            if (!ticketDoc.data().assignDev) {
              setDevelopers(['No Developers Identified']);
            } else {
              const developerDocs = [];

              for (const developerId of ticketDoc.data().assignDev) {
                const devRef = query(collection(db, 'users'), where('uid', '==', developerId));
                const devSnapshot = await getDocs(devRef);
              
                if (!devSnapshot.empty) {
                  const devData = devSnapshot.docs[0].data();
                  developerDocs.push(devData.firstname + ' ' + devData.lastname);
                } else {
                  console.log('Developer document not found for UID ', developerId);
                }
              }

              setDevelopers(developerDocs);
            }
          } else {
            console.log('Ticket not found');
          }
        } catch (error) {
          console.error('Error processing ticket data:', error);
        } finally {
          setLoading(false);
        }
      });

      return () => {
        // Unsubscribe when the component unmounts
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up real-time updates:', error);
      setLoading(false);
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

  const formattedTurnaroundTime = ticketData.turnaroundtime
  ? format(new Date(ticketData.turnaroundtime.seconds * 1000), 'yyyy/MM/dd')
  : 'Not specified';

  // Function to extract filename from a URL
  const getFilenameFromURL = (url) => {
    const decodedURL = decodeURIComponent(url);
    const pathSegments = decodedURL.split('/');
    let filenameWithQuery = pathSegments[pathSegments.length - 1];

    // Remove query parameters if present
    const filenameWithoutQuery = filenameWithQuery.split('?')[0];

    return filenameWithoutQuery;
  };

  function getSeverityId(severity) {
    switch (severity) {
      case 'Critical':
        return 'critical-id';
      case 'High':
        return 'high-id';
      case 'Medium':
        return 'medium-id';
      case 'Low':
        return 'low-id';
      default:
        return ''; // Default case or handle any other severity values
    }
  }

  function getStatusId(severity) {
    switch (severity) {
      case 'Open':
        return 'open-id';
      case 'In Progress':
        return 'in-progress-id';
      case 'Closed':
        return 'closed-id';
      case 'Resolved':
        return 'resolved-id';
      default:
        return ''; // Default case or handle any other severity values
    }
  }

  const acceptTicket = async (ticketId) => {
    if (!ticketId) {
      console.log("No ticket ID identified.")
      return;
    }
  
    const ticketRef = doc(db, 'tickets', ticketId);
  
    try {
      const ticketDoc = await getDoc(ticketRef);
  
      if (ticketDoc.exists()) {
        // Update the status field to "In Progress"
        await updateDoc(ticketRef, {
          status: 'In Progress'
        });
  
        console.log('Ticket status updated to "In Progress"');
      } else {
        console.log('Ticket not found');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }
  
  const closeTicket = async (ticketId) => {
    if (!ticketId) {
      console.log("No ticket ID identified.")
      return;
    }
  
    const ticketRef = doc(db, 'tickets', ticketId);
  
    try {
      const ticketDoc = await getDoc(ticketRef);
  
      if (ticketDoc.exists()) {
        await updateDoc(ticketRef, {
          status: 'Closed'
        });
  
        console.log('Ticket status updated to "Closed"');
      } else {
        console.log('Ticket not found');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }

  const reopenTicket = async (ticketId) => {
    if (!ticketId) {
      console.log("No ticket ID identified.")
      return;
    }
  
    const ticketRef = doc(db, 'tickets', ticketId);
  
    try {
      const ticketDoc = await getDoc(ticketRef);
  
      if (ticketDoc.exists()) {
        const currentTurnaroundTime = ticketDoc.data().turnaroundtime;
        const newTurnaroundTime = addDays(currentTurnaroundTime.toDate(), 7); // Add 7 days to the current date
  
        await updateDoc(ticketRef, {
          status: 'Open',
          turnaroundtime: newTurnaroundTime
        });
  
        console.log('Ticket status updated to "Open", Turnaround time updated.');
      } else {
        console.log('Ticket not found');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const resolveTicket = async (ticketId) => {
    if (!ticketId) {
      console.log("No ticket ID identified.")
      return;
    }
  
    const ticketRef = doc(db, 'tickets', ticketId);
  
    try {
      const ticketDoc = await getDoc(ticketRef);
  
      if (ticketDoc.exists()) {
        await updateDoc(ticketRef, {
          status: 'Resolved'
        });
  
        console.log('Ticket status updated to "Resolved"');
      } else {
        console.log('Ticket not found');
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }

  if (loading || !ticketData) {
    // Render a loading message or spinner while waiting for data
    return <div>Loading...</div>;
  }

  return (
    <div className='ViewTicket'>
      <h2>Ticket ID: {ticketData.id}</h2>
      <div className="new-line">
        <label>Application: <strong>{applicationName ? applicationName : "Retrieving data..."}</strong></label>
      </div>
      <div className="new-line">
        <label>Subject: <strong>{ticketData.subject}</strong></label>
      </div>
      <div className="new-line">
        <label>
          Assigned Developer:
          <strong>
            {developers.length > 0 ? developers.join(', ') : 'No Team Members Identified.'}
          </strong>
        </label>
      </div>
      <div className="new-line">
        <label>Description:</label>
      </div>
      <div className='new-line'>
        <label id='description'>{ticketData.description}</label>
      </div>
      <div className="new-line">
        <label>
          Severity:
          <div id={getSeverityId(ticketData.severity)}>{ticketData.severity}</div>
        </label>
      </div>
      <div className="new-line">
        <label>Status:
          <div id={getStatusId(ticketData.status)}>{ticketData.status}</div>
          <div></div>
        </label>
      </div>
      <div className="new-line">
        <label>Type: <div id='type'>{ticketData.type}</div></label>
      </div>

      {ticketData.tags && Array.isArray(ticketData.tags) && ticketData.tags.length >  0 && (
        <div className='new-line'>
          <label>Tags:</label>
          <ul>
            {ticketData.tags.map((tag, index) => (
              <li key={index}>{tag}</li>
            ))}
          </ul> 
        </div>
      )}

      <div className="new-line">
        <label>Turn-Around Date: <div id='type'> {formattedTurnaroundTime} </div></label>
      </div>

      {ticketData.attachments && ticketData.attachments.length > 0 && (
        <div className='new-line'>
          <label>Attachments:</label>
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
          {sessionStorage.getItem('role') !== 'Developer' && (
            <button className='button' id='mark-as-resolved' onClick={() => resolveTicket(ticketId)}>
              Mark as Resolved
            </button>
          )}
          {sessionStorage.getItem('role') !== 'Developer' && (ticketData.status !== 'Open' && ticketData.status !== 'In Progress') && (
            <button className='button' id='reopen' onClick={() => reopenTicket(ticketId)}>
              Reopen
            </button>
          )}
          {sessionStorage.getItem('role') === 'Developer' && (ticketData.status === 'In Progress') && (
            <button
              className='button'
              id='close'
              onClick={() => closeTicket(ticketId)}>
              Close Ticket
            </button>
          )}
          {sessionStorage.getItem('role') === 'Developer' && (ticketData.status === 'Open') && (
            <button
              className='button'
              id='accept'
              onClick={() => acceptTicket(ticketId)}>
              Accept Ticket
            </button>
          )}
          {sessionStorage.getItem('uid') === ticketData.author && (<button className='button' id='edit' onClick={() => togglePopup(<EditTicket handleClose={closePopup} ticketId={ticketId} userId={sessionStorage.getItem('uid')}/>)}>
            <div id='text'>Edit Ticket</div>
          </button>)}
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
