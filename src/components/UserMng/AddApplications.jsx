import React from 'react'
import { SpaceBar } from '@mui/icons-material';
import { Tab } from '@mui/material';
import { db } from '../../config/firebase-config';
import { storage} from '../../config/firebase-config';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore'; 
import { query } from 'firebase/database';
import { where  } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { doc } from 'firebase/firestore';
import { getDoc } from 'firebase/firestore';

  const AddApplications = ({ handleClose })  => {
    const [input, setInput] = useState({
      applicationname: '',
      teamleader: '',
      assignedQA: '',
      teammembers: [],
      description: '',
    });
    
  const [errorMessage, setErrorMessage] = useState('');

  const handleCancel = () => {
    setInput({
      applicationname: '',
      teamleader: '',
      assignedQA: '',
      teammembers: [],
      description: '',
    });
    setErrorMessage('');
    handleClose();
  };

  const handleMemberInput = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const newMember = e.target.value.trim();
        if (newMember !== '') {
          setInput((prevInput) => ({
            ...prevInput,
            teammembers: [...prevInput.teammembers, newMember],
          }));
          e.target.value = ''; 
        }
      }
    };
    const inputHandler = (e) => {
      const { name, value } = e.target;
    
      setInput((prevInput) => {
        if (name === 'teammembers') {
          // Ensure that teammembers is always an array
          const membersArray = value.split(',').map((member) => member.trim());
          return {
            ...prevInput,
            [name]: membersArray,
          };
        } else {
          return {
            ...prevInput,
            [name]: value,
          };
        }
      });
    };
    
   

    const submitHandler = async (e) => {
      e.preventDefault();

      try {
        setErrorMessage('');
        if (input.applicationname === '') {
          setErrorMessage('All fields are required to be filled.');
          return;
        } else {
          let userData = {
            applicationname: input.applicationname,
            teamleader: input.teamleader,
            assignedQA: input.assignedQA,
            teammembers: input.teammembers, //stores an array directly
            description: input.description,
           
          };


          await addDoc(collection(db, 'applications'), userData);

          setInput({
            applicationname: '',
            teamleader: '',
            assignedQA: '',
            teammembers: [],
            description: '', 
          });

          setErrorMessage('Adding Application Successful');
        }
      }
      
      catch (error) {
        console.error('Adding error:', error);
        setErrorMessage(error.message);
          
      }
    };

    return (
      <div className='AddApplications'>
        <div className='hehe'>
          
          <div id='new-line'>
            <label>Name: </label>
            <input
              type="text"
              name="applicationname"
              value={input.applicationname}
              onChange={(e) => inputHandler(e)} />
          </div>

          <div id='new-line'>
            <label>Team Leader: </label>
            <input
              type="text"
              name="teamleader"
              value={input.teamleader}
              onChange={(e) => inputHandler(e)} />
          </div>

          <div id='new-line'>
            <label>Assigned QA: </label>
            <input
              type="text"
              name="assignedQA"
              value={input.assignedQA}
              onChange={(e) => inputHandler(e)} />
          </div>

          <div id='new-line'>
            <label>Members: </label>
            <input
              type="text"
              name="teammembers"
              placeholder=''
              value={input.teammembers.join(', ')}
              onChange={inputHandler} 
              onKeyPress={(e) => handleMemberInput(e)}

              />

          </div>
          <div className='space' />

          <label>Description: </label>
          <br />
          <textarea
            type="text"
            name='description'
            value={input.description}
            onChange={(e) => inputHandler(e)}
            cols="30"
            rows="10">
          </textarea>
          

          <div className='formbuttons'>
            <button className='submit' onClick={submitHandler}>
              Submit
            </button>
            <button className='cancel' onClick={handleCancel}>
              Cancel
            </button>
          </div>

        </div>

      </div>
    )
  }

export default AddApplications
