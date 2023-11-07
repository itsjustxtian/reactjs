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
import { Auth } from './components/auth/auth';

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
        </Routes>
        </div>
        
        
      </div>
    </Router>
  );
}

export default App;
