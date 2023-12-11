import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useState, useRef } from 'react';
import { storage, db } from '../config/firebase-config';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SelectApplication from './UserMng/SelectApplication';
import Popup from './PopUp';
import Selectmembers from './UserMng/selectmembers';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';


const CreateTicket = ({ handleClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDevelopers, setSelectedDevelopers] = useState([]);
  const [tags, setTags] = useState([]);

  const handleCancel = () => {
    // Clear all values in the input when cancel is pressed
    setInput({
      author: sessionStorage.getItem('uid'),
      subject: '',
      assignDev: '',
      description: '',
      tags: [],
      severity: '',
      type: '',
      attachments: [],
    });
    setFiles([]);
    setErrorMessage('');
    setTags([]);
    setSelectedDevelopers([]);
    setSelectedApplication(null);

    // Reset radio button values
    document.querySelectorAll('input[type="radio"]').forEach((radio) => {
      radio.checked = false;
    });

    handleClose();
  };

  const [input, setInput] = useState({
    author: sessionStorage.getItem('uid'),
    subject: '',
    description: '',
    severity: '',
    type: '',
    attachments: [],
  });

  const tagHandler = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag !== '') {
        setTags((prevTags) => [...prevTags, newTag]);
        e.target.value = ''; // Clear the input field after adding the tag
      }
      console.log("Tags:", tags);
    }
  };

  const inputHandler = (e) => {
    const { name, value } = e.target;
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    //}

  };

  const [files, setFiles] = useState([]);
  const [errormessage, setErrorMessage] = useState('');

  const fileInputRef = useRef(null);

  const handleFileInputChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles([...files, ...Array.from(selectedFiles)]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleRemoveApplication = () => {
    setSelectedApplication(null);
  }

  const handleRemoveMember = (memberToRemove) => {
    // Create a new array excluding the member to be removed
    const updatedMembers = selectedDevelopers.filter(
      (member) => member.id !== memberToRemove.id
    );
  
    // Update the state with the new array
    setSelectedDevelopers(updatedMembers);
  };

  const handleRemoveTag = (index) => {
    // Create a new array excluding the tag to be removed
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);

    // Update the state with the new array
    setTags(updatedTags);
  };


  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage('');
      if (!selectedApplication) {
        console.log("Some fields are emptyyyy.");
        setErrorMessage('All fields are required to be filled.');
        console.log(errormessage);
        return;
      } else {
        let downloadURLs = []; // Array to store download URLs

        // Upload files to storage
        if (files.length > 0) {
          const storageRef = storage;

          for (const selectedFile of files) {
            const fileRef = ref(storageRef, `attachments/${selectedFile.name}`);
            await uploadBytes(fileRef, selectedFile);
            console.log('File uploaded successfully!');

            // Get the download URL for the file
            const downloadURL = await getDownloadURL(fileRef);

            // Add the download URL to the array
            downloadURLs.push(downloadURL);
          }
        }

        let userData = {
          author: sessionStorage.getItem('uid'),
          application: selectedApplication.id,
          subject: input.subject,
          assignDev: selectedDevelopers.map(member => member.id),
          description: input.description,
          tags: tags,
          severity: input.severity,
          status: 'Open',
          type: input.type,
          attachments: downloadURLs,
        };

        console.log('Data to be created:', userData);
        
        await addDoc(collection(db, 'tickets'), userData);

        setInput({
          author: sessionStorage.getItem('uid'),
          subject: '',
          description: '',
          severity: '',
          type: '',
          status: '',
          attachments: [],
        });

        setFiles([]);
        setSelectedApplication(null);
        setSelectedDevelopers([]);
        setTags([]);
        document.querySelectorAll('input[type="radio"]').forEach((radio) => {
          radio.checked = false;
        });

        console.log('Creating new ticket', userData);
        setErrorMessage('Creating new ticket Successful');
        console.log(errormessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage(error.message);
      console.log(errormessage);
    }
  };

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
      console.log('Selected Team Members (Developers) in CreateTicket:', userDetail);
      setSelectedDevelopers(userDetail);
    } else if(userDetail && userDetail.id && userDetail.applicationname) {
      setSelectedApplication(userDetail);
      console.log('Selected Application in CreateTicket:', userDetail);      
    } else {
      console.log('None selected or invalid data format.');
    }
  };

  return (
    <div className='CreateTicket'>
      <div className='typanan'>
        <div id='new-line'>
          <label>Application: </label>
          <button id='add-icon' onClick={() => togglePopup('application')}>
            <AppRegistrationIcon/>
          </button>
          <label id='selected'>
            {selectedApplication ? selectedApplication.applicationname : 'No Application Selected'}
            {selectedApplication && (
              <ClearIcon
              className='clear-icon' 
              onClick={() => handleRemoveApplication(selectedApplication)}
              />
            )}
          </label>
        </div>
        
        <div id='new-line'>
          <label>Subject: </label>
          <input
              type="text" 
              name="subject" 
              value = {input.subject}
              onChange={(e) => inputHandler(e)}
          />
        </div>
        
        <div id='new-line'>
          <label>Assigned Developer: </label>
          <button id='add-icon' onClick={() => togglePopup('members')}>
            <PersonAddAlt1Icon/>
          </button>
          <div id='selectedMembers'>
          {selectedDevelopers.map((member) => (
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
          <label>Description: </label>
        </div>
          <textarea 
            type="text"
            name='description'
            value = {input.description}
            onChange={(e) => inputHandler(e)}
            cols="30" 
            rows="10">
          </textarea>
        
        <div id='new-line-tags'>
        <label>Tags: </label>
          <input
            type="text"
            name="tags"
            placeholder='Input tag then press Enter...'
            onKeyUp={(e) => tagHandler(e)}
          />
          <div id='tagslist'>
          {tags.map((tag, index) => (
            <div key={index} id='tags'>
              <label>
                {tag}
                <ClearIcon
                  className='clear-icon'
                  onClick={() => handleRemoveTag(index)}
                />
              </label>
            </div>
          ))}
          </div>
        </div>
        
        <div id='new-line-radios'>
          <label>Severity/Priority: </label>
          <input type="radio" name="severity" value="Critical" onChange={(e) => inputHandler(e, 'severity')} />
          <label> Critical </label>
          <input type="radio" name="severity" value="High" onChange={(e) => inputHandler(e, 'severity')}/>
          <label> High </label>
          <input type="radio" name="severity" value="Medium" onChange={(e) => inputHandler(e, 'severity')}/>
          <label> Medium </label>
          <input type="radio" name="severity" value="Low" onChange={(e) => inputHandler(e, 'severity')}/>
          <label> Low </label>
        </div>
        
        <div id='new-line-radios'>
          <label>Type: </label>
          <input type="radio" name="type" value="Functional" onChange={(e) => inputHandler(e, 'type')}/>
          <label> Functional </label>
          <input type="radio" name="type" value="Performance" onChange={(e) => inputHandler(e, 'type')}/>
          <label> Performance </label>
          <input type="radio" name="type" value="Usability" onChange={(e) => inputHandler(e, 'type')}/>
          <label> Usability </label>
          <input type="radio" name="type" value="Compatibility" onChange={(e) => inputHandler(e, 'type')}/>
          <label> Compatibility </label>
          <input type="radio" name="type" value="Security" onChange={(e) => inputHandler(e, 'type')}/>
          <label> Security </label>
        </div>
          
        <div id='selectedfiles'>
          <input
            type="file"
            accept="image/*, .pdf, .doc, .docx"  // Define the file types you want to allow
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileInputChange}
            multiple
          />

          <button
            className='addAtt'
            onClick={() => fileInputRef.current.click()} // Trigger file input click on button click
          >
            <AttachFileIcon />
            <div id='addAtt'> Add Attachments </div>
          </button>
            {files.length > 0 && (
              <div>
                <p>Selected Files:</p>
                <ul id='selectedfiles'>
                  {files.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <ClearIcon
                        className='clear-icon'
                        onClick={() => handleRemoveFile(index)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>

        <div className='error-message'>
          {errormessage}
        </div>
            
        <div className='formbuttons'>
          <button className='submit' onClick={submitHandler}>
            Submit
          </button>
          <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel </div>
            </button>
        </div> 

        </div>
        <Popup show={showPopup} handleClose={closePopup}>
          {selectedButton === 'application' && <SelectApplication handleClose={closePopup}/>}
          {selectedButton === 'members' && <Selectmembers handleClose={closePopup}/>}
        </Popup>
    </div>
    
    
  )
}

export default CreateTicket
