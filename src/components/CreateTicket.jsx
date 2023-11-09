import { Tab } from '@mui/material'
import React from 'react'

const CreateTicket = () => {
  
  return (
    <div>
      Create Ticket
      <br/>
    <label>Application: </label>
    <input
        type="text" 
        placeholder="" 
    />

    <br/>
    <label>Subject: </label>
    <input
        type="text" 
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
    <input
        type="text" 
        placeholder="" 
    />
    <br/>
    <label>Tags: </label>
    <input
        type="text" 
        placeholder="" 
    />
    <br/>
    <label>Severity/Priority: </label>
      <label> Critical </label>
      
      <label> High </label>
      
      <label> Medium </label>
      
      <label> Low </label>


      <br/>
      <label>Type: </label>
        <label> Functional </label>
        
        <label> Performance </label>
        
        <label> Usability </label>
        
        <label> Compatibility </label>

        <label> Security </label>

        <br/>
        <button className='rectangle' id='text'>
          <div id='text'> Add Attachments </div>
        </button>

        <br/>
        <br/>
        <Tab></Tab><Tab></Tab><Tab></Tab><Tab></Tab>
        <button className='rectangle' id='text'>
          <div id='text'> Submit </div>
        </button>
        <button className='rectangle' id='text'>
          <div id='text'> Cancel </div>
        </button>

    </div>
    
  )
}

export default CreateTicket
