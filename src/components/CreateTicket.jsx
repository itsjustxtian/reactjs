import { SpaceBar } from '@mui/icons-material';
import { Tab } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React, { useState, useRef } from 'react';
import { storage, db } from '../config/firebase-config';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { serverTimestamp, addDoc, collection } from 'firebase/firestore';
import { query, getDocs, where } from 'firebase/firestore';
import ClearIcon from '@mui/icons-material/Clear';


const CreateTicket = ({ handleClose }) => {
  const handleCancel = () => {
    handleClose();
  };

  const [input, setInput] = useState({
    application: '',
    author: sessionStorage.getItem('uid'),
    subject: '',
    assignDev: '',
    description: '',
    tags: [],
    severity: '',
    type: '',
    attachments: [],
  });

  const handleTagInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag !== '') {
        setInput((prevInput) => ({
          ...prevInput,
          tags: [...prevInput.tags, newTag],
        }));
        e.target.value = ''; // Clear the input field after adding the tag
      }
    }
  };
  

  const inputHandler = (e) => {
    const { name, value } = e.target;

    if (name === 'tags') {
      setInput((prevInput) => ({
        ...prevInput,
        tags: value.split(',').map((tag) => tag.trim()), // Split tags by comma and trim spaces
      }));
    } else {
      setInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));
    }

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

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setErrorMessage('');
      if (input.application === '') {
        console.log("Some fields are emptyyyy.");
        setErrorMessage('All fields are required to be filled.');
        console.log(errormessage);
        return;
      } else {
        let userData = {
          author: sessionStorage.getItem('uid'),
          application: input.application,
          subject: input.subject,
          assignDev: input.assignDev,
          description: input.description,
          tags: input.tags.join(', '),
          severity: input.severity,
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

        await addDoc(collection(db, 'tickets'), userData);

        setInput({
          application: '',
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
    <div className='CreateTicket'>
      <div className='typanan'>
        <div id='new-line'>
          <label>Application: </label>
          <input
              type="text"
              name="application"
              value = {input.application}
              onChange={(e) => inputHandler(e)}/>
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
          <input
              type="text" 
              name="assignDev" 
              value = {input.assignDev}
              onChange={(e) => inputHandler(e)}
          />
        </div>

        <div className='space'/>

        <label>Description: </label>
        <br/>
        <textarea 
          type="text"
          name='description'
          value = {input.description}
          onChange={(e) => inputHandler(e)}
          cols="30" 
          rows="10">
        </textarea>
        
        <div id='new-line'>
        <label>Tags: </label>
          <input
            type="text"
            name="tags"
            placeholder='Please type it as "Tag1, Tag2, Tag3"'
            value={input.tags.join(', ')}
            onChange={inputHandler}        
          />
        </div>
        
        <div id='new-line'>
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
        
        <div id='new-line'>
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
          
        <div>
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
          <ul>
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
            
        <div className='formbuttons'>
          <button className='submit' onClick={submitHandler}>
            Submit
          </button>
          <button className='cancel' id='text'>
              <div id='text' onClick={handleCancel}> Cancel </div>
            </button>
        </div> 

        </div>
    </div>
    
    
  )
}

export default CreateTicket
