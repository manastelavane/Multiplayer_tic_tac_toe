import React, { useState } from "react";
import "./Login.modules.css";
import icon from "../image.ico";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signin } from "../../actions/auth";
const initialState = { username: "", password: "" };
const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState(initialState);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signin(form));
  };
  if (isAuthenticated) {
    setTimeout(() => {
      navigate("/allrooms");
    }, 2000);
  }
  return (
    <div className="logindiv">
      <form onSubmit={handleSubmit}>
        <div className="inner-container">
          <img
            src={icon}
            onClick={() => navigate("/")}
            className="arrowicon"
            alt="back-arrow-icon"
            title="Go to Home Page"
          />
          <h3>Login</h3>
          <div className="register-heading">Please enter your details</div>

          <div className="input-container">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Type your username here"
              required
              onChange={handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Type your password here"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="button-container">
          {isAuthenticated === true && (
            <div className="alertgreen">
              <>Congratulations!!! Logged In.</>
            </div>
          )}
          {error !== null && (
            <div className="alertred">
              <>{error}</>
            </div>
          )}
          <button
            className={`${isAuthenticated === true ? "login auth" : "login"}`}
            type={`${isAuthenticated === true ? "button" : "submit"}`}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
