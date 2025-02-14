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

// Get all rooms with pagination
export const getAllRooms = async (req, res) => {
  try {
    // Extract query parameters for pagination
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 rooms per page if not provided
    const skip = (page - 1) * limit; // Calculate the number of rooms to skip

    // Fetch rooms with pagination
    const rooms = await prisma.room.findMany({
      include: {
        bookings: true, // Include related bookings
      },
      skip: skip, // Skip the specified number of rooms
      take: limit, // Limit the number of rooms returned
    });

    // Get the total number of rooms for pagination metadata
    const totalRooms = await prisma.room.count();

    // Calculate total pages
    const totalPages = Math.ceil(totalRooms / limit);

    // Send response with rooms and pagination metadata
    res.json({
      success: true,
      data: rooms,
      pagination: {
        page,
        limit,
        totalRooms,
        totalPages,
      },
    });
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


export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity, amenities, image } = req.body;

    if (!name || !capacity || !amenities) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: { name, capacity, amenities,image },
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



