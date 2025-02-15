// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getRoomById

} from "../controllers/roomController.js";  // Import the controller methods

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);
router.get("/availability", getRoomAvailability);
router.get("/:id", getRoomById);




export default router;
