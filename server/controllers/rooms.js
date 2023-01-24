import RoomsModal from "../models/rooms.js";
import UserModal from "../models/user.js";
import uniqid from 'uniqid'
export const createroom = async (req, res) => { 
    try {
        // console.log(req.body)
        const {email,admin}=req.body;
        // console.log(email)
        const oldUser = await UserModal.findOne({ email });
        // console.log(typeof(roomId))
        if(!oldUser){
            res.status(404).json({message:"This player does not exist."});
            return;
        }
        if(oldUser.username===admin){
            res.status(404).json({message:"You cannot play with yourself."});
            return;
        }
        const oldRoom=await RoomsModal.findOne({$or:[{adminUsername: admin, rivalUsername:oldUser?.username,won:-1 },{adminUsername: oldUser?.username, rivalUsername:admin,won:-1 }]})
        // console.log({ adminUsername: admin, rivalUsername:oldUser?.username })
        if(oldRoom){
            res.status(404).json({message:"Room with this player already exist."});
            return;
        }
        // console.log(oldUser)
        if(oldUser){
            // console.log("hi")
            const result = await RoomsModal.create({
                roomId:uniqid(),
                rivalUsername:oldUser?.username,
                updatedmovetime:new Date(),
                adminUsername:admin
            });
            // console.log(result)
            res.status(201).json({result});
        }else{
            res.status(404).json({message:"This player does not exist."});
        }

    
        // res.status(200).json({data:cardMessages, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {
        res.status(404).json({ message: error });
    }
};
export const getroom = async (req, res) => { 
    const { id } = req.params;
    // console.log(id)
    try {
        const room = await RoomsModal.findOne({roomId:id});
        // console.log(room)
        res.status(200).json(room);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
export const getallrooms = async (req, res) => { 
    const {username}=req.query;
    // console.log(username)
    try {
        const rooms = await RoomsModal.find({$or:[{adminUsername:username},{rivalUsername:username}]},{adminUsername:1,updatedmovetime:1,rivalUsername:1,move:1,won:1,roomId:1}).sort({updatedmovetime:-1}) ;
        // console.log(rooms)
        res.status(200).json(rooms);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};