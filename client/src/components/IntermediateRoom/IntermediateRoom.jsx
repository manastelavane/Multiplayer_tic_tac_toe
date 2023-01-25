import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createroom } from '../../actions/rooms';
import {nanoid} from 'nanoid'
import icon from '../image.ico'
import { CLEAR_ROOM } from '../../constants/actionTypes';
import './IntermediateRoom.modules.css'

const IntermediateRoom = ({socket}) => {
    const user=JSON.parse(localStorage.getItem('profile'));
    const navigate=useNavigate()
    const dispatch=useDispatch()
//   const {isAuthenticated,error,rival} = useSelector((state) => state.auth);
  const {room,error,isLoading} = useSelector((state) => state.room);
  const [form, setForm] = useState({email:'',admin:user?.result?.username});
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  useEffect(()=>{
    console.log("clear")
    dispatch({ type: CLEAR_ROOM});
},[])
  const handleSubmit = (e) => {
    e.preventDefault();
    const roomId=nanoid(7);
    socket.emit('joinRoom', {username:user?.result?.userName, roomId});
    dispatch(createroom(form))
  };
  if(room){
    navigate(`/room/${room?.result?.roomId}`);
  }
  
//   console.log(user)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem('profile'));
    // socket.emit('joinRoom', {email:user.result.email, roomId});
  },[socket])
  return (
    <div className='logindiv'>
      <form onSubmit={handleSubmit}>
    <div className='inner-container'>
    <img src={icon} onClick={()=>navigate('/allrooms')}className="arrowicon" alt="back-arrow-icon" title="Go to Home Page"/>
      <h3>Start a new game</h3>
      <div className='register-heading'>Whom do you want to play with?</div>
      
      <div className='input-container'>
      <label htmlFor='email'>Email</label>
      <input id="email" value={form.email} name="email" type="email" placeholder='Type your email here' required onChange={handleChange}/> 
      </div>
      
    </div>
    
      <div className='button-container'>
      {error!==null &&<div className='alertred'>
       <>{error}</>
    </div>}
      <button className="intermediate-room-register" type='submit' >
        Start game
      </button>
      </div>
      </form>
    </div>
  )
}

export default IntermediateRoom
