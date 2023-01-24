/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.js";
import roomsRouter from "./routes/rooms.js";
import {DbConnect} from './database.js'
import http from 'http';
import {Server} from 'socket.io';
const app = express();
const server = http.createServer(app);
dotenv.config();
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

const io = new Server(server, {
    cors: {
        origin: process.env.FRONT_URL,
        methods: ['GET', 'POST'],
    },
});
app.use(cors());

DbConnect();
app.use("/user", userRouter);
app.use("/rooms", roomsRouter);
io.on("connection", (socket) => {
    console.log('user connected')
    socket.on('joinRoom', (payload)=>{
        
        console.log('user connected',payload.id)
        addUser(socket.id, payload.id);

        const user = {socketId:socket.id, username:payload.username, roomId:payload.id};

        // newGame(payload.id, payload.username);

        socket.join(user.id);

        socket.emit('message', 'Welcome to ChatCord!');

        const current_room = getGameDetail(user.id);

    })
    socket.on('usersEntered',(payload)=>{
        console.log("userEntered Called",payload.id);
        // const current_game = getGameDetail(payload.id);

        // if(!current_game){
        //     return;
        // }

        // if(current_game.user1.userId === payload.userId){
        //     current_game.user1.inGame = true;
        // }
        // else if(current_game.user2.userId === payload.userId){
        //     current_game.user2.inGame = true;
        // }

        // if(current_game.user1.inGame && current_game.user2.inGame){
        //     io.in(payload.roomId).emit('usersEntered',{user1:current_game.user1, user2:current_game.user2});
        // }

    })
    
});
const PORT = process.env.PORT|| 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));