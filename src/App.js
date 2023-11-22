import './App.css';
import SignIn from './components/auth/SignIn';
import './fonts.css';
import Sidebar from './components/sidebar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inbox from './components/inbox'
import Dashboard from './components/Dashboard'
import Usermanagement from './components/usermanagement'
import Viewapplications from './components/ViewApplications'
import Viewticket from './components/ViewTicket'
import Viewprofile from './components/UserMng/ViewProfile'
import Editprofile from './components/UserMng/EditProfile'
import Viewallusers from './components/UserMng/ViewAllUsers'
import Settings from './components/Settings'
import { Auth } from './components/auth/auth'
import ViewApplications from './components/ViewApplications'
import AddApplications from './components/UserMng/AddApplications';
import Createticket from './components/CreateTicket'
import Registration from './components/auth/registration';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigateBeforeOutlined } from '@mui/icons-material';

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem('authenticated') === 'true'
  );
  

  // Function to handle login and update the authenticated state
  const handleLogin = () => {
    console.log("Login Successful!");
    setAuthenticated(true);
    sessionStorage.setItem('authenticated', 'true');

  };
  
  // Function to handle logout and update the authenticated state
  const handleLogout = () => {
    console.log("Logout Successful!");
    setAuthenticated(false);
    sessionStorage.removeItem('authenticated');
    navigate('/loginscreen');
  };

  // If not authenticated, show the login component
  if (!authenticated) {
    return <SignIn onLogin={handleLogin} />;
  }

  return (
      <div className="App">
        <div className='container'>
        <Sidebar onLogout={handleLogout} />
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/inbox' element={<Inbox/>}/>
          <Route path='/usermanagement' element={<Usermanagement/>}/>
          <Route path='/loginscreen' element={<SignIn/>}/>
          <Route path='/registration' element={<Registration/>}/>
          <Route path='/create-edit' element={<Createticket/>}/>
          <Route path='/showticket' element={<Viewticket/>}/>
          <Route path='/applications' element={<ViewApplications/>}/>
          <Route path='/profile' element={<Viewprofile/>}/>
          <Route path='/edit-profile' element={<Editprofile/>}/>
          <Route path='/view-all-users' element={<Viewallusers/>}/>
          <Route path='/view-all-applications' element={<Viewapplications/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/add-applications' element={<AddApplications/>}/>
        </Routes>
        </div>
        
        
      </div>
  );
}

export default App;