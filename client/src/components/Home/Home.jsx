import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.modules.css";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/allrooms");
    }
  }, [user]);
  return (
    <div className="container">
      <div className="innercontainer">
        <h2>async</h2>
        <h1>tic tac toe</h1>
      </div>
      <div className="button-container">
        <button className="login" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="registerhome" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Home;
