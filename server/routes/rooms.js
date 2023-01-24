import express from "express";
const router = express.Router();

import { createroom, getroom,getallrooms} from "../controllers/rooms.js";

router.post("/createroom", createroom);
router.get("/getroom/:id", getroom);
router.get("/getallrooms", getallrooms);

export default router;