// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,

} from "../controllers/roomController.js";  // Import the controller methods

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);




export default router;
