// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,


 
} from "../controllers/roomController.js"; 

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);




export default router;
