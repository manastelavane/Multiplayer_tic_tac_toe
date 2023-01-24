import mongoose from "mongoose";
import validator from "validator";  

const roomsSchema = mongoose.Schema({
    roomId: {
        type: String, 
    },
    adminUsername: {
        type: String,
    },
    rivalUsername: { 
        type: String, 
    },
    updatedmovetime: {
        type: Date,
        default:Date.now
    },
    move:{
        type:Number,
        default:0
    },
    won:{
        type:Number,
        default:-1
    },
    allMoves:{
        type:[{
            move:Number,
            myMove:Boolean
        }],
        default:[
            {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false}, {move:-1,myMove:false} ,{move:-1,myMove:false},{move:-1,myMove:false}
        ]
    }
});

export default mongoose.model("rooms", roomsSchema);