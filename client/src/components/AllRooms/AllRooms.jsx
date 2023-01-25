import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getallrooms } from "../../actions/rooms";
import Loader from "../Loader/Loader";
import "./AllRooms.modules.css";
import Card from "./Card";
const AllRooms = () => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const userRef = useRef(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [allrooms, setallRooms] = useState([]);
  const { rooms, error, isLoading } = useSelector((state) => state.room);

  if (!user) {
    navigate("/");
  }
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("profile"));
    dispatch(getallrooms(user?.result?.username));
    // console.log("dispatch done");
  }, []);

  useEffect(() => {
    setallRooms(rooms);
    // console.log("setted rooms", allrooms, rooms);
  }, [rooms, allrooms]);
  if (isLoading) {
    return <Loader />;
  }
  return (
    <div className="roomcontainer">
      <h2>Your Game</h2>
      {allrooms === null || allrooms.length === 0 ? (
        <div className="roomszero">
          <h2>No Games Found</h2>
          <div className="button-container-rooms">
            <button
              onClick={() => navigate("/intermediateroom")}
              className="allrooms-register1"
            >
              Start a new game
            </button>
          </div>
        </div>
      ) : (
        <div className="roomsnonzero">
          {allrooms !== null &&
            allrooms?.length !== 0 &&
            allrooms?.map((room, index) => {
              return (
                <div className="card" key={index}>
                  <Card room={room} />
                </div>
              );
            })}
          <div
            className="fixed-new-game"
            onClick={() => navigate("/intermediateroom")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-plus-lg"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
              />
            </svg>
            <h4>New Game</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRooms;
