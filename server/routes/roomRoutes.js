// server/routes/roomRoutes.js
import express from "express";
import {
  createRoom,

} from "../controllers/roomController.js";  // Import the controller methods

const router = express.Router();

// Define routes for rooms
router.post("/", createRoom);





export default router;
