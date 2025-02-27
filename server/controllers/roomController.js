import prisma from "../../prisma/index.js";

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { name, capacity, amenities, image } = req.body;
    const roomCapacity = parseInt(capacity)


    if (!name || !roomCapacity || !amenities) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const room = await prisma.room.create({
      data: { name, capacity: roomCapacity, amenities, image },
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all rooms with pagination
// export const getAllRooms = async (req, res) => {
//   try {

//     // Extract query parameters for pagination
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const skip = (page - 1) * limit;
//     const text = req.query.search || '';
//     const capacity = parseInt(req.query.capacity) || 0;

//     let rangeStart;
//     let rangeEnd;

//     if(capacity == 0){
//       rangeStart=0;
//       rangeEnd=10000;
//     }else{
//       rangeStart=capacity;
//       rangeEnd=capacity+10;
//     }

//     // Fetch rooms with pagination
//     const rooms = await prisma.room.findMany({
//       include: {
//         bookings: true,
//       },
//       skip: skip,
//       take: limit,
//     });

//     // Get the total number of rooms for pagination metadata
//     const totalRooms = await prisma.room.count();

//     // Calculate total pages
//     const totalPages = Math.ceil(totalRooms / limit);

//     // Send response with rooms and pagination metadata
//     res.json({
//       success: true,
//       data: rooms,
//       pagination: {
//         page,
//         limit,
//         totalRooms,
//         totalPages,
//         currentPage:parseInt(page)
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// Get all rooms with pagination and filtering
export const getAllRooms = async (req, res) => {
  try {
    // Extract query parameters for pagination
    let page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const text = req.query.search || '';
    const capacity = parseInt(req.query.capacity) || 0;


    // Determine capacity range
    let rangeStart = capacity === 0 ? 0 : capacity;
    let rangeEnd = capacity === 0 ? 10000 : capacity + 10;

    // Build filter conditions
    const filters = {
      capacity: {
        gte: rangeStart,
        lte: rangeEnd,
      },
    };

    // If search text is provided, filter by name, description, or amenities
    if (text.trim()) {
      filters.OR = [
        { name: { contains: text, mode: "insensitive" } },
        { amenities: { has: text } },
      ];
    }

    // Get total number of matching rooms (without pagination)
    const totalRooms = await prisma.room.count({ where: filters });

    // Reset page to 1 if a filter is applied
    if (text.trim() || capacity > 0) {
      page = 1;
    }

    const skip = (page - 1) * limit; // Recalculate skip after potential reset

    // Fetch rooms with filters, pagination, and including bookings
    const rooms = await prisma.room.findMany({
      where: filters,
      include: { bookings: true },
      skip: skip,
      take: limit,
    });

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
        currentPage: page,
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

    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Manually delete related bookings
    await prisma.booking.deleteMany({ where: { roomId: id } });

    // Now delete the room
    await prisma.room.delete({ where: { id } });

    res.json({ message: "Room and related bookings deleted successfully" });
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
      data: { name, capacity, amenities, image },
    });

    res.json(updatedRoom);
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getRoomAvailability = async (req, res) => {
  try {
    const { roomId, date } = req.query;

    if (!roomId || !date) {
      return res.status(400).json({ error: "Room ID and date are required!" });
    }

    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30 * 60 * 1000;

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const bookings = await prisma.booking.findMany({
      where: {
        roomId,
        startTime: { gte: startOfDay, lte: endOfDay },
      },
    });

    let slots = [];
    let currentTime = new Date(`${date}T${startHour}:00:00.000Z`);

    while (currentTime.getHours() < endHour) {
      let nextTime = new Date(currentTime.getTime() + slotDuration);

      const isBooked = bookings.some((booking) => {
        return new Date(booking.startTime) < nextTime && new Date(booking.endTime) > currentTime;
      });

      slots.push({
        startTime: currentTime.toISOString(),
        endTime: nextTime.toISOString(),
        status: isBooked ? "Booked" : "Available",
      });

      currentTime = nextTime;
    }

    res.json({ roomId, date, slots });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch availability" });
  }
};

// export const getRoomById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "Id is require!" })
//     }
//     const room = await prisma.room.findUnique({
//       where: { id }, 
//       include: {
//         bookings: true,
//       },
//     });
//     if (!room) {
//       return res.status(404).json({ error: "Room not found" });
//     }
//     return res.status(200).json({ room })
//   } catch (error) {
//     return res.status(400).json({ error: "Something is went wrong" })
//   }
// }


export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Id is required!" });
    }

    // Get current date without time (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const room = await prisma.room.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            startTime: { gte: today }, // Fetch bookings from today onwards
          },
          orderBy: { startTime: "asc" }, // Sort by start time (earliest first)
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    return res.status(200).json({room}); // Return the room with all future bookings
  } catch (error) {
    console.error("Error fetching room:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const getFavoriteRooms = async (req, res) => {
  try {
      const { roomIds } = req.body; 

      if (!roomIds || !Array.isArray(roomIds) || roomIds.length === 0) {
          return res.status(400).json({ error: "Room IDs are required as an array!" });
      }

      const rooms = await prisma.room.findMany({
          where: { id: { in: roomIds } },
      });

      if (rooms.length === 0) {
          return res.status(404).json({ error: "No rooms found!" });
      }

      res.status(200).json(rooms);
  } catch (error) {
      console.error("Error fetching favorite rooms:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get unique amenities
export const getUniqueAmenities = async (req, res) => {
  try {
    // Fetch all rooms and only include the amenities
    const rooms = await prisma.room.findMany({
      select: {
        amenities: true,  // Select only the amenities field
      },
    });

    // Flatten the array of amenities
    const allAmenities = rooms.flatMap(room => room.amenities);

    // Extract unique amenities
    const uniqueAmenities = [...new Set(allAmenities)];

    // Return unique amenities
    res.json({ success: true, uniqueAmenities });
  } catch (error) {
    console.error("Error fetching unique amenities:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

