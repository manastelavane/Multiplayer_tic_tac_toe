import React, { useEffect, useRef, useState } from "react";
import "./Room.modules.css";
import icon from "../image.ico";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getroom } from "../../actions/rooms";
const Room = ({ socket }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const [adminMoves, setAdminMoves] = useState([]);
  const [rivalMoves, setRivalMoves] = useState([]);
  const [totalmove, setTotalMove] = useState(0);
  const [winner, setWinner] = useState(-1);
  const [temp, settemp] = useState(-1);
  const ref = useRef(-1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { room, isLoading } = useSelector((state) => state.room);
  useEffect(() => {
    if (room) {
      if (user?.result?.username === room?.adminUsername) {
        setAdminMoves(room?.adminMoves);
        setRivalMoves(room?.rivalMoves);
        setTotalMove(room?.move);
        if (room?.won === 1) setWinner(1);
        else if (room?.won === 0) setWinner(0);
        else if (room?.won === 2) setWinner(2);
      } else {
        setAdminMoves(room?.adminMoves);
        setRivalMoves(room?.rivalMoves);
        setTotalMove(room?.move);
        if (room?.won === 0) setWinner(1);
        else if (room?.won === 1) setWinner(0);
        else if (room?.won === 2) setWinner(2);
      }
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
        setAdminMoves((prev) => [...prev, payload.amove]);
        setTotalMove((prev) => prev + 1);
      } else {
        setRivalMoves((prev) => [...prev, payload.rmove]);
        setTotalMove((prev) => prev + 1);
      }
    });
    socket.on("win", (payload) => {
      if (payload.username === user.result.username) {
        setWinner(1);
      } else {
        setWinner(0);
      }
    });

    socket.on("draw", (payload) => {
      setWinner(2);
    });
  }, []);

  const handleSubmit = (m) => {
    if (room?.adminUsername === user.result.username) {
      setTotalMove((prev) => prev + 1);
      socket.emit("move", {
        amove: ref.current,
        adminMoves: adminMoves,
        rivalMoves: rivalMoves,
        roomId: room.roomId,
        username: user.result.username,
      });
    } else {
      setTotalMove((prev) => prev + 1);
      socket.emit("move", {
        rmove: ref.current,
        adminMoves: adminMoves,
        rivalMoves: rivalMoves,
        roomId: room.roomId,
        username: user.result.username,
      });
    }
    ref.current = -1;
  };
  const handleMoveClick = (m) => {
    if (room.won !== -1) {
      return;
    }
    if (winner !== -1) {
      return;
    }
    if (room?.adminUsername === user.result.username && totalmove % 2 !== 0) {
      return;
    } else if (
      room?.rivalUsername === user.result.username &&
      totalmove % 2 === 0
    ) {
      return;
    }
    if (room?.adminUsername === user.result.username) {
      if (ref.current !== -1) {
        ref.current = m;
        const tempmoves = [...adminMoves];
        tempmoves[tempmoves.length - 1] = m;
        setAdminMoves(tempmoves);
      } else {
        ref.current = m;
        setAdminMoves((prev) => [...prev, m]);
      }
    } else {
      if (ref.current !== -1) {
        ref.current = m;
        const tempmoves = [...rivalMoves];
        tempmoves[tempmoves.length - 1] = m;
        setRivalMoves(tempmoves);
      } else {
        ref.current = m;
        setRivalMoves((prev) => [...prev, m]);
      }
    }
  };
  const checkEmpty = (m) => {
    const x = adminMoves?.includes(m);
    const y = rivalMoves?.includes(m);
    return !(x || y);
  };
  const checkMyMove = (m) => {
    if (room) {
      if (user.result.username === room?.adminUsername) {
        let x = adminMoves?.includes(m);
        return x;
      } else {
        let x = rivalMoves?.includes(m);
        return x;
      }
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
      <div className="register-heading">
        Game with{" "}
        {user?.result?.username === room?.adminUsername
          ? room?.rivalUsername
          : room?.adminUsername}
      </div>
      <div className="my-piece-info">
        <p>Your piece</p>
        <div className="my-piece-x">X</div>
      </div>
      <div
        className={`${
          winner === -1
            ? user?.result?.username === room?.adminUsername
              ? totalmove % 2 === 0
                ? "result yellow"
                : "result yellow"
              : totalmove % 2 !== 0
              ? "result yellow"
              : "result yellow"
            : winner === 0
            ? "result red"
            : winner === 1
            ? "result green"
            : winner === 2
            ? "result yellow"
            : "result"
        }`}
      >
        {winner === -1
          ? user?.result?.username === room?.adminUsername
            ? totalmove % 2 === 0
              ? "Your move"
              : "Thier Move"
            : totalmove % 2 !== 0
            ? "Your move"
            : "Thier move"
          : winner === 0
          ? "You lost"
          : winner === 1
          ? "You win"
          : winner === 2
          ? "It's a Draw"
          : ""}
      </div>
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
        <button
          className="room-register"
          type="submit"
          onClick={
            winner !== -1
              ? () => navigate("/intermediateroom")
              : ref.current !== -1
              ? () => handleSubmit()
              : null
          }
        >
          {winner !== -1 ? "Start another game" : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Room;
