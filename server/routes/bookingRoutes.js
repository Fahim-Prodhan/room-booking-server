import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/user/:userId", getUserBookings);
router.put("/:bookingId", updateBooking);

export default router;