import React, { useState } from 'react'
import './Register.modules.css'
import icon from '../image.ico';
import { useNavigate } from 'react-router-dom';
import {signup} from '../../actions/auth';
import { useDispatch, useSelector} from 'react-redux';
const initialState = { name: '', username:'', email: '', password: ''};

const Register = () => {
  const navigate=useNavigate()
  const dispatch=useDispatch();
  const {isAuthenticated,error} = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form)
    dispatch(signup(form));
  };
  if(isAuthenticated){
    setTimeout(() => {
      navigate('/allrooms')
    }, 2000);
  }
  return (
    <div className='registerdiv'>
    <form onSubmit={handleSubmit}>
    <div className='inner-container'>
      <img src={icon} className="arrowicon" alt="back-arrow-icon" onClick={()=>navigate('/')} title="Go to Home Page"/>
      <h3>Create account</h3>
      <div className='register-heading'>Let's get to know you better!</div>
      <div className='input-container'>
      <label htmlFor='name'>Your name</label>
      <input id="name" name='name' type="text" placeholder='Type your name here' required onChange={handleChange}/> 
      </div>
      <div className='input-container'>
      <label htmlFor='username'>Username</label>
      <input id="username" name='username' type="text" placeholder='Type your username here' required onChange={handleChange}/> 
      </div>
      <div className='input-container'>
      <label htmlFor='email'>Email</label>
      <input id="email" name='email' type="email" placeholder='Type your email here' required onChange={handleChange}/> 
      </div>
      <div className='input-container'>
      <label htmlFor='password'>Password</label>
      <input id="password" name='password' type="password" placeholder='Type your password here' required onChange={handleChange} /> 
      </div>
    </div>
      <div className='button-container'>
      {isAuthenticated===true &&<div className='alertgreen'>
       <>Congratulations!!! Account created.</>
    </div>}
      {error!==null &&<div className='alertred'>
       <>{error}</>
    </div>}
      <button className={`${isAuthenticated===true?'register-register auth':'register-register'}`} type={`${isAuthenticated===true?'button':'submit'}`}>
        Register
      </button>
      </div>
      </form>
    </div>
  )
}

export default Register
