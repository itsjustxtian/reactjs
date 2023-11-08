import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
/*import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';*/
import './fonts.css';
import Sidebar from './components/sidebar'
/*import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';*/
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

function App() {
  return (
    <Router>
      <div className="App">
        <div className='container'>
        <Sidebar/>
        <Routes>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/inbox' element={<Inbox/>}/>
          <Route path='/usermanagement' element={<Usermanagement/>}/>
          <Route path='/loginscreen' element={<SignIn/>}/>
          <Route path='/registration' element={<SignIn/>}/>
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
    </Router>
  );
}

export default App;
