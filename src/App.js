import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import './fonts.css';
import Sidebar from './components/sidebar'
/*import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import inbox from './components/inbox'
import Dashboard from './components/Dashboard'
import usermanagement from './components/usermanagement'

function App() {
  return (
    <Router>
      <div className="App">
        <div className='container'>
        <Sidebar/>
        <Dashboard></Dashboard> {/* Change this line to your component */}
        </div>
        
        <Routes>
          <Route path='/dashboard' element={Dashboard}/>
          <Route path='/inbox' element={inbox}/>
          <Route path='/usermanagement' element={usermanagement}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
