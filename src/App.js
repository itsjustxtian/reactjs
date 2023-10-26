import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import './fonts.css';
import Sidebar from './components/sidebar'

function App() {
  return (
    <div className="App">
      <Sidebar/>
      {/*<SignIn/>
      <SignUp/>
      <AuthDetails/>*/}
    </div>
  );
}

export default App;
