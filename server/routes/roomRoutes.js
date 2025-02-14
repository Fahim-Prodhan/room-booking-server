// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,
  deleteRoom,

} from "../controllers/roomController.js";  // Import the controller methods

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);
router.delete("/:id", deleteRoom);




export default router;
