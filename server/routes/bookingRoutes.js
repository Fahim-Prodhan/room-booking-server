import express from "express";
import {
  createBooking,
  getAllBookings,
  getUserBookings,
  updateBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/user/:userId", getUserBookings);
router.put("/:bookingId", updateBooking);
router.delete("/:bookingId", deleteBooking);



export default router;