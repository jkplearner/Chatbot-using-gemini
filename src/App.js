import './App.css';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Home from './Components/HomePage'
import Login from './Components/LoginPage';
import Signup from './Components/SignUpPage';
import BOT from './chatbot/bot';
function App() {
  return (
    <Router>
      <>
      <Routes>
        <Route exact path='/' element={<Home/>}></Route>
        <Route path='/Login' element={<Login/>}></Route>
        <Route path='/signup' element={<Signup/>}></Route>
        <Route path='/Bot' element={<BOT/>}></Route>
      </Routes>
      </>
    </Router>
  );
}

export default App;
