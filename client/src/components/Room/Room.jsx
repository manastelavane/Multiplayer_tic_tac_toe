import React, { useEffect, useState } from 'react'
import './Room.modules.css'
import icon from '../image.ico'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getroom } from '../../actions/rooms';
const moves = [{move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false} ,{move:-1,myMove:false},{move:-1,myMove:false}];
const Room = ({socket}) => {
  const user=JSON.parse(localStorage.getItem('profile'));
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const location = useLocation();
    const {id}=useParams()
  const {room,isLoading} = useSelector((state) => state.room);

    useEffect(() => {
        dispatch(getroom(id))
    }, []);
    useEffect(()=>{

      window.onbeforeunload = function() { 
        window.setTimeout(function () { 
          window.location = '/';
          socket.emit('removeRoom', {roomId});
        }, 0); 
        window.onbeforeunload = null; 
      }
  
      window.history.pushState(null, document.title, window.location.href);
      window.addEventListener('popstate', function (event){
          window.history.pushState(null, document.title,  window.location.href);
      });
  
    })
  
    const params = useParams();
  
    const [roomId, setRoomId] = useState('');
  
    const [loading, setLoading] = useState(true);
  
    const [loadingValue, setLoadingValue] = useState("waiting for another player...");
  
    const [userJoined, setUserJoined] = useState(false);
  
    const [userTurn, setUserTurn] = useState(false);
  
    const [oponentName, setOponentName] = useState('');
  
    const [move, setMove] = useState();
  
    const [allMoves, setAllMoves] = useState([]);
  
    const [winner, setWinner] = useState("");
    const [winnerId, setWinnerId] = useState("");
  
    const [winPattern, setWinPattern] = useState([]);
  
    const [gameEnd, setGameEnd] = useState(false);
  
    const [leaveRoom, setLeaveRoom] = useState(false);
  
    const [myScore, setMyScore] = useState(0);
    const [oponentScore, setOponentScore] = useState(0);
  
    useEffect(() => {
  
      if(!user){
        window.location = '/';
      }
  
      socket.emit('usersEntered', {roomId: params.id, username:user?.result?.username})
  
      socket.off('usersEntered').on('usersEntered', (data) => {
        if(data.user1.username !== user?.result?.username){
          setOponentName(data.user1.username)
        }
        else{
          setOponentName(data.user2.username)
        }
        setLoading(false);
        // console.log(data);
      })
  
    },[socket, user, params.idd])
    
    useEffect(() => {
      setRoomId(params.id);
      // console.log(params.roomId);
  
    },[params.id]);
  
    const handleMoveClick = (m) => {
  
      if(loading && !userJoined){
        return;
      }
  
      socket.emit('move', {move:m, roomId, username:user?.result?.username});
  
      moves[m].move = 1;
      moves[m].myMove = true;
  
      setUserTurn(true);
    }
  
    const handlePlayAgain = () => {
      socket.emit('reMatch', {roomId});
    }
  
    useEffect(()=>{
      socket.on('move', (payload)=>{
        // console.log(payload);
        setMove({move:payload.move, myMove:payload.username===user?.result?.username});
        setAllMoves([...allMoves, move]);
  
        moves[payload.move].move = 1;
        moves[payload.move].myMove = payload.username===user?.result?.username;
  
        if(payload.username!==user?.result?.username){
          setUserTurn(false);
        }
  
      })
  
      socket.on('win', (payload)=>{
        // console.log("WINNER WINNER WINNER!!! ",payload);
        setWinPattern(payload.pattern);
        setGameEnd(true);
        if(payload.username===user?.result?.username){
          setWinner('You won!');
          setMyScore(myScore+1);
        }
        else{
          setWinner(`You lost!, ${payload.username} won!`);
          setOponentScore(oponentScore+1);
        }
  
        setWinnerId(payload.username);
        setUserTurn(false);
      })
  
      socket.on('draw', (payload)=>{
        // console.log("DRAW DRAW DRAW!!! ",payload);
        setWinner('Draw !');
        setGameEnd(true);
        setUserTurn(false);
        setLoadingValue('')
      })
  
    })
  
  
  
    useEffect(()=>{
  
      socket.on('removeRoom', (payload) => {
        // console.log("removeRoom",payload);
        setUserJoined(false);
        setLeaveRoom(true);
      })
    })
    
  
    useEffect(()=>{
  
      socket.on('userLeave', (payload) => {
        console.log("userLeave",payload);
        setLoadingValue('');
        setLoadingValue(`${oponentName} left the game`);
        setLoading(true);
        setUserJoined(false);
      })
    })
  
  
    const handleClose = ()=>{
      socket.emit('removeRoom', {roomId});
      return true;
    }
  if(isLoading){
    return (
        <>Loading...</>
    )
  }
  return (
   
    <div className='inner-container'>
    <img src={icon} onClick={()=>navigate('/allrooms')}className="arrowicon" alt="back-arrow-icon" title="Go to Home Page"/>
      <div className='register-heading'>Game with {room?.rivalUsername}</div>
    <div className='my-piece-info'>
      <p>Your piece</p>
      <div className='my-piece-x'>X</div>
    </div>
    <div className='result'>
        You win
    </div>
    <div className='grid-container'>
      <div className='grid-item bottom right'><div className='content'>X</div></div>
      <div className='grid-item bottom right'><div className='content'>X</div></div>
      <div className='grid-item bottom '><div className='content'>X</div></div>
      <div className='grid-item bottom right'><div className='content'>X</div></div>
      <div className='grid-item bottom right'><div className='content'>X</div></div>
      <div className='grid-item bottom '><div className='content'>X</div></div>
      <div className='grid-item right'><div className='content'>X</div></div>
      <div className='grid-item right'><div className='content'>X</div></div>
      <div className='grid-item'><div className='content'>X</div></div>
    </div>
    
      <div className='button-container-register'>
      <button className="room-register" type="submit">
        Submit
      </button>
      </div>
      
      </div>
  )
}

export default Room
