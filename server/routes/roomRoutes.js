// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getRoomById,
  getFavoriteRooms

} from "../controllers/roomController.js";  

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);
router.get("/", getAllRooms);
router.delete("/:id", deleteRoom);
router.put("/:id", updateRoom);
router.get("/availability", getRoomAvailability);
router.get("/:id", getRoomById);
router.post("/favorites", getFavoriteRooms);




export default router;
