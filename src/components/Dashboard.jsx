import React from 'react'
import NoteAddIcon from '@mui/icons-material/NoteAdd';

const dashboard = () => {
  return (
    <div className='dashboard'>
      <div className='buttoncontainer'>
        <button className='rectangle' id='text'>
          <NoteAddIcon id='icon'/>
          <div id='text'>Create New..a.</div>
        </button>
      </div>
      
      <div className='space'></div>
      
      <div className='table'>
        <div className='rectangle'>

        </div>
      </div>

    </div>
  )
}

export default dashboard
