/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import roomsRouter from "./routes/rooms.js";
import { DbConnect } from "./database.js";
import http from "http";
import { Server } from "socket.io";
import RoomsModal from "./models/rooms.js";
const app = express();
const server = http.createServer(app);
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const io = new Server(server, {
  cors: {
    origin: process.env.FRONT_URL,
    methods: ["GET", "POST"],
  },
});
app.use(cors());

DbConnect();
app.use("/user", userRouter);
app.use("/rooms", roomsRouter);
function CheckWin(newadminMoves, newrivalMoves) {
  const winPatterns = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7],
  ];
  let isWin;
  let won = -1;
  for (let i = 0; i < winPatterns.length; i++) {
    let win_pattern = winPatterns[i];
    isWin = true;
    for (let j = 0; j < win_pattern.length; j++) {
      if (!newadminMoves.includes(win_pattern[j])) {
        isWin = false;
      }
    }
    if (isWin === true) {
      break;
    }
  }
  if (isWin === true) {
    won = 1;
    return { isWin, won };
  }
  for (let i = 0; i < winPatterns.length; i++) {
    let win_pattern = winPatterns[i];
    isWin = true;
    for (let j = 0; j < win_pattern.length; j++) {
      if (!newrivalMoves.includes(win_pattern[j])) {
        isWin = false;
      }
    }
    if (isWin === true) {
      break;
    }
  }
  // console.log("isWin: ", isWin);
  if (isWin) {
    won = 1;
    return { isWin, won };
  }
  return { isWin, won };
}
io.on("connection", (socket) => {
  socket.on("join_room", (payload) => {
    socket.join(payload.roomId);
  });
  socket.on("move", async (payload) => {
    socket.to(payload.roomId).emit("move", {
      amove: payload?.amove,
      rmove: payload?.rmove,
      adminMoves: payload.adminMoves,
      rivalMoves: payload.rivalMoves,
      username: payload.username,
    });
    if (payload?.amove) {
      const arr = payload.adminMoves;
      const room = await RoomsModal.findOne({ roomId: payload.roomId });
      const updateroom = {
        _id: room._id,
        roomId: room.roomId,
        adminUsername: room.adminUsername,
        rivalUsername: room.rivalUsername,
        rivalMoves: payload.rivalMoves,
        move: room.move + 1,
        won: room.won,
        adminMoves: arr,
        updatedmovetime: new Date(),
      };
      await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
    } else {
      const arr = payload.rivalMoves;
      // arr.push(payload.rmove)
      const room = await RoomsModal.findOne({ roomId: payload.roomId });
      const updateroom = {
        _id: room._id,
        roomId: room.roomId,
        adminUsername: room.adminUsername,
        rivalUsername: room.rivalUsername,
        adminMoves: payload.adminMoves,
        move: room.move + 1,
        won: room.won,
        rivalMoves: arr,
        updatedmovetime: new Date(),
      };
      await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
    }
    let newadminMoves, newrivalMoves;
    if (payload?.amove) {
      newadminMoves = payload.adminMoves;
      newrivalMoves = payload.rivalMoves;
    } else {
      newrivalMoves = payload.rivalMoves;
      newadminMoves = payload.adminMoves;
    }
    if (newadminMoves.length + newrivalMoves.length >= 3) {
      const { isWin, won } = CheckWin(newadminMoves, newrivalMoves);
      if (isWin) {
        io.in(payload.roomId).emit("win", { username: payload.username });
        const room = await RoomsModal.findOne({ roomId: payload.roomId });
        const updateroom = {
          _id: room._id,
          roomId: room.roomId,
          adminUsername: room.adminUsername,
          rivalUsername: room.rivalUsername,
          adminMoves: room.adminMoves,
          move: room.move,
          won: won,
          rivalMoves: room.rivalMoves,
          updatedmovetime: new Date(),
        };
        await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
        return;
      }
      if (newadminMoves.length + newrivalMoves.length >= 9) {
        io.in(payload.roomId).emit("draw", { username: payload.username });
        const room = await RoomsModal.findOne({ roomId: payload.roomId });
        const updateroom = {
          _id: room._id,
          roomId: room.roomId,
          adminUsername: room.adminUsername,
          rivalUsername: room.rivalUsername,
          adminMoves: room.adminMoves,
          move: room.move,
          won: 2,
          rivalMoves: room.rivalMoves,
          updatedmovetime: new Date(),
        };
        await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
        return;
      }
    }
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
