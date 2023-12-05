import { Tab } from '@mui/material'
import React from 'react'

const ViewProfile = () => {
  return (
    <div className='viewProfile'>
          Connect nalang nis database(ata)
        <div className='box'>
            <div className="rectangle" />
          </div>
          
          <div className='appLabel'>
            <div id= 'new-line1'> 
              <label>
              NAME
              </label>
            </div>

            <div id= 'new-line'> 
              <label>
              COMPANY ID
              </label>
            </div>

            <div id= 'new-line'> 
              <label>
              EMAIL
              </label>
            </div>

            <div id= 'new-line2'> 
              <label>
              Status
              </label>
            </div>

            <div id= 'new-line3'> 
              <label>
              Assignments:
              </label>
            </div>

            <div id= 'new-line4'> 
              <label>
              Application 1 <Tab></Tab> <Tab></Tab>  Team Leader 1
              </label>
            </div>

            <div id= 'new-line4'> 
              <label>
              Application 2 <Tab></Tab> <Tab></Tab>  Team Leader 2
              </label>
            </div>

            <br>
            </br>
              AMBOT SAKTO BA
          </div>
      
    </div>
  )
}

export default ViewProfile
