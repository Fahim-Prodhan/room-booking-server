// server/controllers/roomController.js
import prisma from "../../prisma/index.js";  // Import Prisma client

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, capacity, amenities } = req.body;

    if (!name || !capacity || !amenities) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const room = await prisma.room.create({
      data: { name, capacity, amenities },
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



