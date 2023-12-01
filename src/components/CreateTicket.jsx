import { SpaceBar } from '@mui/icons-material'
import { Tab } from '@mui/material'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import React from 'react'

const CreateTicket = ({handleClose}) => {
  const handleCancel = () => {
    handleClose();
  };

  return (
    <div className='CreateTicket'>
      <div className='typanan'>
        <div id='new-line'>
          <label>Application: </label>
          <input
              type="text"/>
        </div>
        
        <div id='new-line'>
          <label>Subject: </label>
          <input
              type="sub" 
              placeholder="" 
          />
        </div>
        
        <div id='new-line'>
          <label>Assigned Developer: </label>
          <input
              type="text" 
              placeholder="" 
          />
        </div>

        <div className='space'/>

        <label>Description: </label>
        <br/>
        <textarea 
          description=""
          cols="30" 
          rows="10">
        </textarea>
        
        <div id='new-line'>
          <label>Tags: </label>
          <input
              type="tags" 
              placeholder="" 
          />
        </div>
        
        <div id='new-line'>
          <label>Severity/Priority: </label>
          <input type="radio" name="severity" value="Critical" />
          <label> Critical </label>
          <input type="radio" name="severity" value="High" />
          <label> High </label>
          <input type="radio" name="severity" value="Medium" />
          <label> Medium </label>
          <input type="radio" name="severity" value="Low" />
          <label> Low </label>
        </div>
        
        <div id='new-line'>
          <label>Type: </label>
          <input type="radio" name="ticketType" value="Functional" />
          <label> Functional </label>
          <input type="radio" name="ticketType" value="Performance" />
          <label> Performance </label>
          <input type="radio" name="ticketType" value="Usability" />
          <label> Usability </label>
          <input type="radio" name="ticketType" value="Compatibility" />
          <label> Compatibility </label>
          <input type="radio" name="ticketType" value="Security" />
          <label> Security </label>
        </div>
          
        <div>
          <button className='addAtt'>
            <AttachFileIcon/>
            <div id='addAtt' onClick = {() => document.getElementById('profilePicture').click()}> Add Attachments </div>
          </button>
        </div>
            
        <div className='formbuttons'>
          <button className='submit'>
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
