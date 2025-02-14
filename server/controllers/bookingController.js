import prisma from '../../prisma/index.js'

export const createBooking = async (req, res) => {
    try {
        const { roomId, userId, title, description, startTime, endTime } = req.body;

        if (!roomId || !userId || !title || !startTime || !endTime) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const conflictBooking = await prisma.booking.findFirst({
            where: {
                roomId,
                OR: [
                    { startTime: { lte: endTime }, endTime: { gte: startTime } },
                ]
            }
        })

        if (conflictBooking) {
            return res.status(400).json({ error: "Room is already book for this time!" })
        }

        const booking = await prisma.booking.create({
            data: { roomId, userId, title, description, startTime, endTime },
        })

        res.status(201).json(booking);

    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
      const bookings = await prisma.booking.findMany();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };