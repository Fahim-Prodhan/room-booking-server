// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getRoomById,
  getFavoriteRooms,
  getUniqueAmenities

} from "../controllers/roomController.js";  

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);
router.get("/room", getRoomAvailability);
router.get("/get-single-room/:id", getRoomById);
router.post("/favorites", getFavoriteRooms);
router.get("/amenities", getUniqueAmenities);


export default router;
