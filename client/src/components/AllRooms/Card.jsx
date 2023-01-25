import React from "react";
import { useNavigate } from "react-router-dom";
import "./AllRooms.modules.css";

const Card = ({ room }) => {
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();
  // console.log(room);
  const date = new Date(room.updatedmovetime);
  const day = date.toLocaleString("en-US", { day: "numeric" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const hour = date.toLocaleString("en-US", { hour: "numeric" }).slice(0, -3);
  const minute = date.toLocaleString("en-US", { minute: "numeric" });
  const period = date
    .toLocaleString("en-US", { hour12: true, hour: "numeric" })
    .slice(-2);
  const daySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const formattedDate = `${day}${daySuffix(
    day
  )} ${month} ${year}, ${hour}:${minute} ${period}`;
  // console.log();
  return (
    <div>
      <div className="card-heading">
        Game with{" "}
        {user.result.username === room?.adminUsername
          ? room?.rivalUsername
          : room?.adminUsername}
      </div>
      <br />
      {(room.adminUsername === user.result.username && room.won === 1) ||
      (room.rivalUsername === user.result.username && room.won === 0) ? (
        <div>
          <h3>You won!</h3>
        </div>
      ) : (room.rivalUsername === user.result.username && room.won === 1) ||
        (room.adminUsername === user.result.username && room.won === 0) ? (
        <div>You lost!</div>
      ) : room.won === 2 ? (
        <div>It's a Draw!</div>
      ) : (user.result.username === room.adminUsername &&
          room.move % 2 === 0) ||
        (user.result.username === room.rivalUsername && room.move % 2 === 1) ? (
        <div>
          {room.move !== 0 ? (
            <h3>
              {user?.result?.username === room?.adminUsername
                ? room?.rivalUsername
                : room?.adminUsername}{" "}
              just made thier move!
            </h3>
          ) : (
            <span></span>
          )}
          <h3>It's your turn to play now.</h3>
        </div>
      ) : (
        <div>
          {room.move !== 0 ? <h3>You've made you move!</h3> : <span></span>}
          <h3>Waiting for them.</h3>
        </div>
      )}
      <br />
      {formattedDate}
      <br />
      <br />
      <div
        className="allrooms-register"
        onClick={() => navigate(`/room/${room.roomId}`)}
      >
        {room.won === -1 &&
        ((user.result.username === room.adminUsername && room.move % 2 === 0) ||
          (user.result.username === room.rivalUsername &&
            room.move % 2 === 1)) ? (
          <>Play!</>
        ) : (
          <>View game</>
        )}
      </div>
    </div>
  );
};

export default Card;
