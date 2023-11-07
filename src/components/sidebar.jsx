import React from 'react'
import '../App';
import {SidebarData} from './SidebarData'
import { Avatar } from '@mui/material';


function UserProfile(props) {
  return (
    <div className="UserProfile">
      <div className='UserImage'>
      <Avatar src="/broken-image.jpg" className='ProfileImage'/>
      </div>
      <div className="UserInfo">
        {/* Add your name and email here */}
        <h3>{props.name}</h3>
        <p id='email'>{props.email}</p>
      </div>
    </div>
  );
}


function Sidebar() {
  const name = "Your Name";
  const email = "your.email@example.com"

  return (
    <div className='Sidebar'>
      <div>
        <UserProfile name = {name} email={email}/>
      </div>
      <ul className='SidebarList'>
        {SidebarData.map((val, key) => {
          return (
            <li
              key={key}
              className='row'
              id = {window.location.pathname == val.link ? "active" : ""}
              onClick={() => {window.location.pathname = val.link
              }}
            >
              <div id='icon'>{val.icon}</div>{" "}
              <div id='title'>
                {val.title}
              </div>
            </li>
          )
        })}
      </ul>
      </div>
  )
}

export default Sidebar
