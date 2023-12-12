import './App.css';
import SignIn from './components/auth/SignIn';
import './fonts.css';
import Sidebar from './components/sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inbox from './components/inbox';
import Dashboard from './components/Dashboard';
import Usermanagement from './components/usermanagement';
import ViewApplications from './components/ViewApplications';
import ViewTicket from './components/ViewTicket';
import Viewprofile from './components/UserMng/ViewProfile';
import Editprofile from './components/UserMng/EditProfile';
import Viewallusers from './components/UserMng/ViewAllUsers';
import Settings from './components/Settings';
import ViewAllApplications from './components/ViewAllApplications';
import AddApplications from './components/UserMng/AddApplications';
import Createticket from './components/CreateTicket';
import Registration from './components/auth/registration';
import SuggestionBox from './components/SuggestionBox';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigateBeforeOutlined } from '@mui/icons-material';

function App() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(
    sessionStorage.getItem('authenticated') === 'true'
  );

  const handleLogin = () => {
    console.log('Login Successful!');
    setAuthenticated(true);
    sessionStorage.setItem('authenticated', 'true');
  };

  const handleLogout = () => {
    console.log('Logout Successful!');
    setAuthenticated(false);
    sessionStorage.removeItem('authenticated');
    navigate('/loginscreen');
  };

  if (!authenticated) {
    return <SignIn onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <div className="container">
        <Sidebar onLogout={handleLogout} />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/usermanagement" element={<Usermanagement />} />
          <Route path="/loginscreen" element={<SignIn />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/create-edit" element={<Createticket />} />
          <Route path="/showticket/" element={<ViewTicket />} />
          <Route path='/suggestions-box' element={<SuggestionBox/>}/>
          <Route path="/applications" element={<ViewApplications />} />
          <Route path="/edit-profile" element={<Editprofile />} />
          <Route path="/view-all-applications" element={<ViewAllApplications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/add-applications" element={<AddApplications />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
