import { Tab } from '@mui/material'
import React from 'react'

const CreateTicket = () => {
  
  return (
    <div className='CreateTicket'>
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
        <button className='rectangle' id='text'>
          <div id='text'> Add Attachments </div>
        </button>

        <br/>
        <br/>
        <Tab></Tab><Tab></Tab><Tab></Tab><Tab></Tab>
        <button className='rectangle' id='text'>
          <div id='text'>
            
            
             Submit </div>
        </button>

        
        <button className='rectangle' id='text'>
          <div id='text'> Cancel </div>
        </button>

    </div>
    
  )
}

export default CreateTicket
