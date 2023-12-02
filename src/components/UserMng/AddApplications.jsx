import React from 'react'

const AddApplications = () => {
  return (
    <div className='add-application'>

      <div id='new-line'>
        <label>
          Name:
        </label>
        <input/>
      </div>

      <div id='new-line'>
        <label>
          Team Leader:
        </label>
        <input/>
      </div>

      <div id='new-line'>
        <label>
          Assigned QA:
        </label>
        <input/>
      </div>

      <div id='new-line'>
        <label>
          Members:
        </label>
        <input/>
      </div>

      <div className='space'/>

      <div id='new-line'>
        <label>
          Description:
        </label>
      </div>

      <div id='new-line'>
        <textarea
          cols={30}
          rows={10}/>
      </div>

      <div className='formbuttons'>
          <button className='submit'>
            Submit
          </button>
          <button className='cancel' id='text'>
              <div id='text'> Cancel </div>
            </button>
        </div> 

    </div>
  )
}

export default AddApplications
