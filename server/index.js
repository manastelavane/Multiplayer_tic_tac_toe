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
import RoomsModal from "./models/rooms.js";
// import { updateMoves } from "./controllers/rooms.js";
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
    socket.on('join_room', (payload)=>{
        
        console.log('user connected',payload.roomId)
        // addUser(socket.id, payload.id);

        // const user = {socketId:socket.id, username:payload.username, roomId:payload.id};

        // newGame(payload.id, payload.username);

        socket.join(payload.roomId);

        // socket.emit('message', 'Welcome to ChatCord!');


    })
    socket.on('move', async(payload)=>{
       
        // const current_room =  await getGameDetail(payload.roomId);
        // let current_username;
        // let moveCount;

        // if(!current_room.user1.userId || !current_room.user2.userId){
        //     io.in(payload.roomId).emit('userLeave',{});
        //     // console.log("user left");
        // }
        
        // if(current_room.user1.userId == payload.userId){
        //     current_room.user1.moves.push(payload.move);
        //     moveCount = current_room.user1.moves.length;
        //     current_username = current_room.user1.username;
        // }
        // else {
        //     current_room.user2.moves.push(payload.move);
        //     moveCount = current_room.user2.moves.length;
        //     current_username = current_room.user2.username;
        // }
        // if(payload.adminMoves===undefined){
        //     payload.adminMoves=[]
        //   }
        //   if(payload.rivalMoves===undefined){
        //     payload.rivalMoves=[]
        //   }
        // console.log(payload.,payload.rivalMoves)
        io.in(payload.roomId).emit('move',{amove:payload?.amove,rmove:payload?.rmove,adminMoves:payload.adminMoves,rivalMoves:payload.rivalMoves});
        if(payload?.amove){
            const arr=payload.adminMoves
            arr.push(payload.amove)
            const room = await RoomsModal.findOne({roomId:payload.roomId});
            console.log("hi")
            console.log(room)
            const updateroom={
                _id:room._id,
                roomId:room.roomId,
                adminUsername:room.adminUsername,
                rivalUsername:room.rivalUsername,
                rivalMoves:payload.rivalMoves,
                move:room.move,
                won:room.won,
                adminMoves:arr,
            }
            console.log(updateroom)
            // await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
        }else{
            const arr=payload.rivalMoves
            arr.push(payload.rmove)
            const room = await RoomsModal.findOne({roomId:payload.roomId});
            const updateroom={
                _id:room._id,
                roomId:room.roomId,
                adminUsername:room.adminUsername,
                rivalUsername:room.rivalUsername,
                adminMoves:payload.adminMoves,
                move:room.move,
                won:room.won,
                rivalMoves:arr,
            }
            console.log(updateroom)
            // await RoomsModal.findByIdAndUpdate(room._id, updateroom, { new: true });
        }
        // if(moveCount>=3){
        //     const {isWin, winCount, pattern} = CheckWin(payload.roomId, payload.userId);

        //     if(isWin){
                
        //         io.in(payload.roomId).emit('win',{userId:payload.userId, username:current_username, pattern});
        //         return;
        //     }

        //     if(current_room.user1.moves.length + current_room.user2.moves.length >= 9){
        //         io.in(payload.roomId).emit('draw', {roomId:payload.roomId});
        //         return;
        //     }
        // }
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