import React from 'react'

const ViewApplications = () => {
  return (
    <div className='viewApplications'>
      <h1>View Applications</h1>
      
      <div className="label2"> APPLICATION NAME</div>

      <div className='box'>
        <div className="rectangle" />
      </div>

      <div className="label1"> Team Leader:</div>
        <div className="text1"> Leader Name </div>

        <div className="label2"> Team Leader: Leader Name</div>
        <div className="text2"> Assigne QA: QA Name</div>
          
        <br/>
        <div className="label3"> Description: </div>
        <div className="text3"> Description: dasjkhfghkajsf asfhasjfghk fas afgakf fghjkadsgf</div>

        <br/>
        <div className="label4"> Bug History </div>
        <div className="label5"> Status <input type="checkbox" /></div>
      </div>
  )
}

export default ViewApplications
