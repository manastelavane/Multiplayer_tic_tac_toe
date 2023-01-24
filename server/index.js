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
io.on('connection', (socket)=>{
    // console.log('Socket is active to be connected');
    // console.log(socket.id,"socket")
    socket.on('joinRoom', (payload)=>{

        addUser(socket.id, payload.roomId);

        const user = {socketId:socket.id, username:payload.username, roomId:payload.roomId};

        newGame(payload.roomId, payload.userId, payload.username);

        socket.join(user.roomId);

        socket.emit('message', 'Welcome to ChatCord!');

    })

    socket.on('joinExistingRoom', (payload)=>{

        addUser(socket.id, payload.roomId);

        const user = {socketId:socket.id, username:payload.username, roomId:payload.roomId};

        const roomExists = getGameDetail(payload.roomId);

        if(!roomExists){
            socket.emit('message', {error:'Room does not exist'});
            return;
        }

        if(!newGame(payload.roomId, payload.userId, payload.username)){
            socket.emit('message', {error:'Room is full'});
            return;
        }

        socket.join(user.roomId);

        socket.emit('message', 'Welcome to ChatCord!');


        socket.to(payload.roomId).emit('userJoined',`${payload.username} has joined the chat`);


        return;

    })

    socket.on('usersEntered',(payload)=>{
        // console.log("userEntered Called");
        const current_game = getGameDetail(payload.roomId);

        if(!current_game){
            return;
        }

        if(current_game.user1.userId === payload.userId){
            current_game.user1.inGame = true;
        }
        else if(current_game.user2.userId === payload.userId){
            current_game.user2.inGame = true;
        }

        if(current_game.user1.inGame && current_game.user2.inGame){
            io.in(payload.roomId).emit('usersEntered',{user1:current_game.user1, user2:current_game.user2});
        }

    })
    
    socket.on('move', async(payload)=>{
       
        const current_room =  await getGameDetail(payload.roomId);
        let current_username;
        let moveCount;

        if(!current_room.user1.userId || !current_room.user2.userId){
            io.in(payload.roomId).emit('userLeave',{});
            // console.log("user left");
        }
        
        if(current_room.user1.userId == payload.userId){
            current_room.user1.moves.push(payload.move);
            moveCount = current_room.user1.moves.length;
            current_username = current_room.user1.username;
        }
        else {
            current_room.user2.moves.push(payload.move);
            moveCount = current_room.user2.moves.length;
            current_username = current_room.user2.username;
        }

        
        io.in(payload.roomId).emit('move',{move:payload.move, userId:payload.userId});

        if(moveCount>=3){
            const {isWin, winCount, pattern} = CheckWin(payload.roomId, payload.userId);

            if(isWin){
                
                io.in(payload.roomId).emit('win',{userId:payload.userId, username:current_username, pattern});
                return;
            }

            if(current_room.user1.moves.length + current_room.user2.moves.length >= 9){
                io.in(payload.roomId).emit('draw', {roomId:payload.roomId});
                return;
            }
        }
    })


    socket.on('reMatch', (payload)=>{

        let currGameDetail = getGameDetail(payload.roomId);

        currGameDetail.user1.moves = [];
        currGameDetail.user2.moves = [];

        io.in(payload.roomId).emit('reMatch',{currGameDetail});

    })


    socket.on('removeRoom', (payload)=>{
        
        io.in(payload.roomId).emit('removeRoom',("remove"));

        removeRoom(payload.roomId);

    })

    socket.on('disconnect', ()=>{

        const roomId = userLeft(socket.id);

        io.in(roomId).emit('userLeave',{roomId});
    })

})
const PORT = process.env.PORT|| 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));