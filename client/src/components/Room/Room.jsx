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
