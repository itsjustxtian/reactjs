import React, { useState, useEffect } from 'react'
import Popup from '../PopUp'
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Selectteamlead from './selectteamlead';
import Selectqa from './selectqa';
import Selectmembers from './selectmembers'
import { db } from '../../config/firebase-config';
import { doc, addDoc, collection, serverTimestamp, getDoc, where, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';
import { query } from 'firebase/database';

const EditApplications = ({handleClose, appId}) => {
  const handleCancel = () => {
    handleClose();
  }


  const [showPopup, setShowPopup] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [data, setData] = useState(null);
  const [selectedTeamLead, setSelectedTeamLead] = useState(null);
  const [selectedQa, setSelectedQa] = useState(null);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState([]);
  const [errormessage, setErrorMessage] = useState('');
  //const [input, setInput] = useState('');
  const [input, setInput] = useState({
    applicationname: '',
    description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!appId) {
          console.log("App ID is missing.");
          return;
        }
  
        const appRef = doc(db, 'applications', appId);
        const appDoc = await getDoc(appRef);
  
        if (appDoc.exists()) {
          setData(appDoc.data());
  
          input.applicationname = appDoc.data().applicationname;
          input.description = appDoc.data().description;
  
          // Getting the teamleader value
          const leaderUid = appDoc.data().teamleader;
  
          // Use 'where' to query based on the 'uid' field
          const leaderQuery = query(collection(db, 'users'), where('uid', '==', leaderUid));
          const leaderDocs = await getDocs(leaderQuery);
  
          if (leaderDocs.docs.length > 0) {
            const leaderDocData = leaderDocs.docs[0].data();
            console.log("leaderDoc", leaderDocData);
            setSelectedTeamLead(leaderDocData)
          } else {
            console.log("leaderDoc doesn't exist.", leaderUid);
          }

          // Getting the assignedqa value
          const qaUid = appDoc.data().assignedqa;
  
          // Use 'where' to query based on the 'uid' field
          const qaQuery = query(collection(db, 'users'), where('uid', '==', qaUid));
          const qaDocs = await getDocs(qaQuery);
  
          if (qaDocs.docs.length > 0) {
            const qaDocData = qaDocs.docs[0].data();
            console.log("QA data", qaDocData);
            setSelectedQa(qaDocData)
          } else {
            console.log("QA data doesn't exist.", qaUid);
          }

          // Getting the assignedqa value
          const devUids = appDoc.data().teammembers;
          const developerDocs = []
            for (const developerUid of devUids) {
              // Create a query to find the document with the matching 'uid' field
              const q = query(collection(db, 'users'), where('uid', '==', developerUid));
              const querySnapshot = await getDocs(q);
      
              if (querySnapshot.docs.length > 0) {
                // Assuming there is only one document for each 'uid'
                const devDoc = querySnapshot.docs[0];
                //console.log("Developer document for UID ", developerUid, ": ", devDoc.data());
                developerDocs.push(devDoc.data());
                // Do something with the developer document
              } else {
                console.log("Developer document not found for UID ", developerUid);
              }
            }
          setSelectedTeamMembers(developerDocs)

        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [appId]);
  



  const togglePopup = (button) => {
    setSelectedButton(button);
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  const closePopup = (userDetail) => {
    setShowPopup(false);
    setSelectedButton(null);
    console.log('Received userDetail:', userDetail);
    // Check if data is provided and matches the expected structure
    if (Array.isArray(userDetail) && userDetail.every((user) => user.id && user.firstname && user.lastname && user.role === "Developer")) {
      console.log('Selected Team Members (Developers) in AddApplications:', userDetail);
      setSelectedTeamMembers(userDetail);
    } else if(userDetail && userDetail.id && userDetail.firstname && userDetail.lastname && userDetail.role === "Team Leader") {
      console.log('Selected Team Lead in AddApplications:', userDetail);
      setSelectedTeamLead(userDetail);
    } else if(userDetail && userDetail.id && userDetail.firstname && userDetail.lastname && userDetail.role === "Quality Assurance") {
      console.log('Selected Quality Assurance Personnel in AddApplications:', userDetail);
      setSelectedQa(userDetail);
    } else {
      console.log('None selected or invalid data format.');
    }
  };

  const handleRemovetl = () => {
    setSelectedTeamLead(null);
  }

  const handleRemoveqa = () => {
    setSelectedQa(null);
  }
  const handleRemoveMember = (memberToRemove) => {
    // Create a new array excluding the member to be removed
    const updatedMembers = selectedTeamMembers.filter(
      (member) => member.id !== memberToRemove.id
    );
  
    // Update the state with the new array
    setSelectedTeamMembers(updatedMembers);
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;

    setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Now you can access detailed data in selectedTeamLead
    /*console.log('Application name:', input.applicationname);
    console.log('Team Leader:', selectedTeamLead.uid)
    console.log('Assigned QA: ', selectedQa.uid)
    {selectedTeamMembers.map((member) => (
      console.log("Team Member: ", member.id)
    ))}
    console.log('Description: ', input.description)*/

    try {
      setErrorMessage('');
      if (input.applicationname === '') {
        console.log("Some fields are empty.");
        setErrorMessage('All fields are required to be filled.');
        console.log(errormessage);
        return;
      } else {
        let appData = {
          author: sessionStorage.getItem('uid'),
          applicationname: input.applicationname,
          teamleader: selectedTeamLead.uid,
          assignedqa: selectedQa.uid,
          teammembers: selectedTeamMembers.map(member => member.uid),
          description: input.description,
          datecreated: serverTimestamp(),
        };

        await updateDoc(doc(db, 'applications', appId), appData);

        console.log('Creating new application', appData);
        setErrorMessage('New Application Created Successfully!');
        setTimeout(() => {
          // Reload the page after a 2-second delay
          window.location.reload();
        }, 2000);
        console.log(errormessage);
      }
    } catch (error) {
      console.error('Creation error:', error);
      setErrorMessage(error.message);
      console.log(errormessage);
    }
  };

  return (
    <div className='add-application'>

      <div id='new-line'>
        <label>
          Name:
        </label>
        <input
          type='text'
          name='applicationname'
          value={input.applicationname}
          onChange={(e) => inputHandler(e)}
          />
      </div>

      <div id='new-line'>
        <label>
          Team Leader:
        </label>
        <button id='add-icon' onClick={() => togglePopup('teamLead')}>
          <PersonAddAlt1Icon/>
        </button>
        <label id='selectedtl'>
          {selectedTeamLead ? selectedTeamLead.lastname + ', ' + selectedTeamLead.firstname : 'No Team Lead selected'}
          {selectedTeamLead && (
            <ClearIcon
            className='clear-icon' 
            onClick={() => handleRemovetl(selectedTeamLead)}
            />
          )}
        </label>
      </div>

      <div id='new-line'>
        <label>
          Assigned QA:
        </label>
        <button id='add-icon' onClick={() => togglePopup('qA')}>
          <PersonAddAlt1Icon/>
        </button>
        <label id='selectedtl'>
          {selectedQa ? selectedQa.lastname + ', ' + selectedQa.firstname : 'No Quality Assurance Personnel selected'}
          {selectedQa && (
            <ClearIcon
            className='clear-icon' 
            onClick={() => handleRemoveqa(selectedQa)}
            />
          )}
        </label>
      </div>

      <div id='new-line' >
        <label>
          Members:
        </label>
        <button id='add-icon' onClick={() => togglePopup('members')}>
          <PersonAddAlt1Icon/>
        </button>
        <div id='selectedMembers'>
        {selectedTeamMembers.map((member) => (
          <div key={member.id} id='list'>
            <label>
              {member.lastname + ', ' + member.firstname}
              <ClearIcon
              className='clear-icon'
              onClick={() => handleRemoveMember(member)}
              />
            </label>
          </div>
        ))}
        </div>
      </div>

      <div id='new-line'>
        <label>
          Description:
        </label>
      </div>

      <div id='new-line'>
        <textarea
          type='text'
          name='description'
          value={input.description}
          onChange={(e) => inputHandler(e)}
          cols={30}
          rows={10}/>
      </div>

      <div className='error-message'>
          {errormessage}
      </div>

      <div className='formbuttons'>
          <button className='submit' onClick={handleSubmit}>
            Submit
          </button>
          <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel </div>
            </button>
        </div> 

        <Popup show={showPopup} handleClose={closePopup}>
          {selectedButton === 'teamLead' && <Selectteamlead handleClose={closePopup} />}
          {selectedButton === 'qA' && <Selectqa handleClose={closePopup} />}
          {selectedButton === 'members' && <Selectmembers handleClose={closePopup} />}
        </Popup>

    </div>
  )
}

export default EditApplications
