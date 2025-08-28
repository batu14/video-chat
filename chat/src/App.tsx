import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Page/Login'
import SignUp from './Page/SignUp'
import Rooms from './Page/Rooms'
import Profile from './Page/Profile'
import RoomPage from './Page/RoomPage';
import Home from './Page/Home'
import Friends from './Page/Friends'


const App = () => {
  
  return (

    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:roomId" element={<RoomPage />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </Router>

  )
}

export default App