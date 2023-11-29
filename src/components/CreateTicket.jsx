import { SpaceBar } from '@mui/icons-material'
import { Tab } from '@mui/material'
import React from 'react'

const CreateTicket = ({handleClose}) => {
  const handleCancel = () => {
    handleClose();
  };

  return (
    <div className='CreateTicket'>
      Create Ticket
      <br/>
      <div className='typanan'>
      <label>Application: </label>
    <input
        type="text" 
        placeholder="" 
    />

    <br/>
    <label>Subject: </label>
    <input
        type="sub" 
        placeholder="" 
    />

    <br/>
    <label>Assigned Developer: </label>
    <input
        type="text" 
        placeholder="" 
    />

    <br/>
    <label>Description: </label>
    <br/>
    <textarea description="" id="" cols="30" rows="10"></textarea>
    
    <br/>
    <label>Tags: </label>
    <input
        type="tags" 
        placeholder="" 
    />
      </div>
    

    <label>Severity/Priority: </label>
      <input type="checkbox"/>
      <label> Critical </label>
      <input type="checkbox"/>
      <label> High </label>
      <input type="checkbox"/>
      <label> Medium </label>
      <input type="checkbox"/>
      <label> Low </label>


    <br/>
      <label>Type: </label>
      <input type="checkbox"/>
        <label> Functional </label>
        <input type="checkbox"/>
        <label> Performance </label>
        <input type="checkbox" />
        <label> Usability </label>
        <input type="checkbox"/>
        <label> Compatibility </label>
        <input type="checkbox"/>
        <label> Security </label>

        <br/>
        <button className='addAtt' id='text'>
          <div id='addAtt'> Add Attachments </div>
        </button>

        <br/>
        <br/>
        <button className='submit' id='text'>
          <div id='text'>
             Submit </div>
        </button>
  
        <button className='cancel' id='text'>
          <div id='text' onClick={handleCancel}> Cancel </div>
        </button>

    </div>
    
    
  )
}

export default CreateTicket
