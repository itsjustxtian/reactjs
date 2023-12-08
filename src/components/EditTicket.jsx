import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useState, useRef, useEffect } from 'react';
import { storage, db } from '../config/firebase-config';
import { uploadBytes, ref } from 'firebase/storage';
import { addDoc, collection, doc, getDocs, getDoc, query, where } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SelectApplication from './UserMng/SelectApplication';
import Popup from './PopUp';
import Selectmembers from './UserMng/selectmembers';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const EditTicket = ({handleClose, ticketId, userId}) => {
    console.log('Passed data in Edit Ticket: ', ticketId, userId);
    const [data, setData] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [selectedDevelopers, setSelectedDevelopers] = useState([]);
    const [tags, setTags] = useState([]);
    const [input, setInput] = useState({
        author: sessionStorage.getItem('uid'),
        subject: '',
        description: '',
        severity: '',
        type: '',
        attachments: [],
      });

    useEffect(() => {
        const fetchData = async () => {
          try {
            if(!ticketId){
                console.log("Ticket ID is missing.");
                return;
            }

            const ticketRef = doc(db, 'tickets', ticketId);
            const ticketDoc = await getDoc(ticketRef);

            if (ticketDoc.exists()) {
                console.log('Ticket Data:', ticketDoc.data());
                setSelectedApplication(ticketDoc.data().application);
                setSelectedDevelopers(ticketDoc.data().assignDev);
                setTags(ticketDoc.data().tags);
                updateInputState(ticketDoc.data());
            } else {
              console.log("No Matching Documents.");
            }
          } catch (error) {
            console.error("Error fetching data: ", error);
            // Handle the error condition here
          }
        };
    
        fetchData();
        // Include dependencies in the array if needed (e.g., [ticketId])
      }, [ticketId]);

      const updateInputState = (fetchedData) => {
        setInput({
          author: sessionStorage.getItem('uid'),
          subject: fetchedData.subject, // Use the fetched data or default to an empty string
          description: fetchedData.description,
          severity: fetchedData.severity,
          type: fetchedData.type,
          attachments: fetchedData.attachments,
        });

        console.log('Input state updated successfully:', input);
      };
    

    const handleCancel = () => {
        handleClose();
      };

    const togglePopup = (button) => {
    setSelectedButton(button);
    setShowPopup((prevShowPopup) => !prevShowPopup);
    };


    const closePopup = (userDetail) => {
        setShowPopup(false);
        setSelectedButton(null);
    };

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
            let userData = {
              author: sessionStorage.getItem('uid'),
              application: selectedApplication.applicationname,
              subject: input.subject,
              assignDev: selectedDevelopers.map(member => member.id),
              description: input.description,
              tags: tags,
              severity: input.severity,
              status: 'Open',
              type: input.type,
              attachments: files.map((file) => file.name),
            };
    
            // Upload files to storage
            if (files.length > 0) {
              const storageRef = storage;
    
              for (const selectedFile of files) {
                const fileRef = ref(storageRef, `attachments/${selectedFile.name}`);
                await uploadBytes(fileRef, selectedFile);
                console.log('File uploaded successfully!');
              }
            }
    
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

  return (
    <div className='edit-ticket'>
        <div className='typanan'>
            <div id='new-line'>
                <label>Application: </label>
                <button id='add-icon' onClick={() => togglePopup('application')}>
                    <AppRegistrationIcon/>
                </button>
                <label id='selected'>
                    {selectedApplication ? selectedApplication : 'No Application Selected'}
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

        </div>

        <div className='formbuttons'>
            <button className='save-changes' id='text'>
              <div id='text' onClick={handleCancel}> Save Changes </div>
            </button>
            <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel Edit </div>
            </button>
        </div> 
    </div>
  )
}

export default EditTicket
