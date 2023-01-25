import React, { useEffect, useState } from "react";
import "./Room.modules.css";
import icon from "../image.ico";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getroom } from "../../actions/rooms";
const Room = ({ socket }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [adminMoves, setAdminMoves] = useState([]);
  const [rivalMoves, setRivalMoves] = useState([]);
  const [temp, settemp] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { room, isLoading } = useSelector((state) => state.room);
  useEffect(() => {
    console.log("array set");
    if (room) {
      if (user?.result?.username === room?.adminUsername) {
        setAdminMoves(room?.adminMoves);
        setRivalMoves(room?.rivalMoves);
      } else {
        setAdminMoves(room?.rivalMoves);
        setRivalMoves(room?.adminMoves);
      }
      console.log("first render", adminMoves, rivalMoves);
    }
  }, [room]);
  useEffect(() => {
    socket.emit("join_room", { roomId: params.id });
  }, [params.id, socket]);
  useEffect(() => {
    dispatch(getroom(params.id));
  }, []);
  useEffect(() => {
    socket.on("move", (payload) => {
      if (payload.amove) {
        console.log(payload.amove);
        setAdminMoves((prev) => [...prev, payload.amove]);
      } else {
        console.log(payload.rmove);

        setRivalMoves((prev) => [...prev, payload.rmove]);
      }
    });
  }, []);

  const handleMoveClick = (m) => {
    console.log(m);
    if (room?.adminUsername === user.result.username) {
      console.log("adminMoves before in if of handlemove", adminMoves);
      socket.emit("move", {
        amove: m,
        adminMoves: adminMoves,
        rivalMoves: rivalMoves,
        roomId: room.roomId,
      });
      console.log("adminMoves after in if of handlemove", adminMoves);
    } else {
      console.log("rivalMoves before in if of handlemove", rivalMoves);
      socket.emit("move", {
        rmove: m,
        adminMoves: adminMoves,
        rivalMoves: rivalMoves,
        roomId: room.roomId,
      });
    }
    console.log("before emit", adminMoves, rivalMoves);
  };
  const checkEmpty = (m) => {
    const x = adminMoves?.includes(m);
    const y = rivalMoves?.includes(m);
    return !(x || y);
  };
  const checkMyMove = (m) => {
    if (user.result.username === room?.adminUsername) {
      console.log("admin");
      let x = adminMoves?.includes(m);
      return x;
    } else {
      console.log("rival");
      let x = rivalMoves?.includes(m);
      console.log(x);
      return x;
    }
  };
  if (isLoading) {
    return <>Loading...</>;
  }
  return (
    <div className="inner-container">
      <img
        src={icon}
        onClick={() => navigate("/allrooms")}
        className="arrowicon"
        alt="back-arrow-icon"
        title="Go to Home Page"
      />
      <div className="register-heading">Game with {room?.rivalUsername}</div>
      <div className="my-piece-info">
        <p>Your piece</p>
        <div className="my-piece-x">X</div>
      </div>
      <div className="result">You win</div>
      <div className="grid-container">
        <div
          className="grid-item bottom right"
          onClick={checkEmpty(1) === true ? () => handleMoveClick(1) : null}
        >
          <div
            className={`${
              checkEmpty(1) === false
                ? checkMyMove(1)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(1) === false ? (checkMyMove(1) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item bottom right"
          onClick={checkEmpty(2) === true ? () => handleMoveClick(2) : null}
        >
          <div
            className={`${
              checkEmpty(2) === false
                ? checkMyMove(2)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(2) === false ? (checkMyMove(2) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item bottom "
          onClick={checkEmpty(3) === true ? () => handleMoveClick(3) : null}
        >
          <div
            className={`${
              checkEmpty(3) === false
                ? checkMyMove(3)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(3) === false ? (checkMyMove(3) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item bottom right"
          onClick={checkEmpty(4) === true ? () => handleMoveClick(4) : null}
        >
          <div
            className={`${
              checkEmpty(4) === false
                ? checkMyMove(4)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(4) === false ? (checkMyMove(4) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item bottom right"
          onClick={checkEmpty(5) === true ? () => handleMoveClick(5) : null}
        >
          <div
            className={`${
              checkEmpty(5) === false
                ? checkMyMove(5)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(5) === false ? (checkMyMove(5) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item bottom"
          onClick={checkEmpty(6) === true ? () => handleMoveClick(6) : null}
        >
          <div
            className={`${
              checkEmpty(6) === false
                ? checkMyMove(6)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(6) === false ? (checkMyMove(6) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item right"
          onClick={checkEmpty(7) === true ? () => handleMoveClick(7) : null}
        >
          <div
            className={`${
              checkEmpty(7) === false
                ? checkMyMove(7)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(7) === false ? (checkMyMove(7) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item right"
          onClick={checkEmpty(8) === true ? () => handleMoveClick(8) : null}
        >
          <div
            className={`${
              checkEmpty(8) === false
                ? checkMyMove(8)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(8) === false ? (checkMyMove(8) ? "X" : "O") : null}
          </div>
        </div>
        <div
          className="grid-item"
          onClick={checkEmpty(9) === true ? () => handleMoveClick(9) : null}
        >
          <div
            className={`${
              checkEmpty(9) === false
                ? checkMyMove(9)
                  ? "content x"
                  : "content o"
                : "content"
            }`}
          >
            {checkEmpty(9) === false ? (checkMyMove(9) ? "X" : "O") : null}
          </div>
        </div>
      </div>

      <div className="button-container-register">
        <button className="room-register" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Room;
