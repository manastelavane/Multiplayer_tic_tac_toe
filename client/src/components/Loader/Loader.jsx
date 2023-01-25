import React from "react";
import "./Loader.css";
const Loader = () => {
  // useEffect(()=>{
  //   window.scrollTo(0,0)
  // },[])
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <br />
      <h3>Loading...</h3>
      <br />
    </div>
  );
};

export default Loader;
