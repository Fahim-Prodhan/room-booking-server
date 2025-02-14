import prisma from "../../prisma/index.js";  

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, capacity, amenities,image } = req.body;
    const roomCapacity = parseInt(capacity)
    

    if (!name || !roomCapacity || !amenities) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const room = await prisma.room.create({
      data: { name, capacity:roomCapacity, amenities, image },
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
    const rooms = await prisma.room.findMany(
      {
        include: {
          bookings: true 
        }
      }
    );
    res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room exists
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Delete the room
    await prisma.room.delete({ where: { id } });

    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



