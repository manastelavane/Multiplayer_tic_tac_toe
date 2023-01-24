import { Routes, Route} from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import './App.css'
import AllRooms from './components/AllRooms/AllRooms';
import io from 'socket.io-client';
import IntermediateRoom from './components/IntermediateRoom/IntermediateRoom';
import Room from './components/Room/Room';
const socket = io.connect('http://localhost:5000');
function App() {
  return (
    <div>
      <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/login" exact element={<Login/>} />
            <Route path="/register" exact element={<Register/>} />
            <Route path="/allrooms" exact element={<AllRooms socket={socket}/>} />
            <Route path="/intermediateroom" exact element={<IntermediateRoom socket={socket} />} />
            <Route path="/room/:id" exact element={<Room socket={socket}/>} />

          </Routes>
    </div>
  );
}

export default App;