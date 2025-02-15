import prisma from '../../prisma/index.js'

export const createBooking = async (req, res) => {
    try {
        const { roomId, userId, title, description, startTime, endTime } = req.body;


        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start.getTime() === end.getTime()) {
            return res.status(400).json({ message: "Start and End Time Can't be Same!" })
        } else if (start.getTime() > end.getTime()) {
            return res.status(400).json({ message: "End time must be After the Start Time" })
        }

        if (!roomId || !userId || !title || !startTime || !endTime) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: "Invalid date format. Use ISO 8601 format." });
        }

        const conflictBooking = await prisma.booking.findFirst({
            where: {
                roomId,
                AND: [
                    { startTime: { lte: end }, endTime: { gte: start } },
                ]
            }
        })



        if (conflictBooking) {
            return res.status(400).json({ message: "Room is already book for this time!" })
        }

        const booking = await prisma.booking.create({
            data: { roomId, userId, title, description, startTime: start, endTime: end },
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

export const getUserBookings = async (req, res) => {

    const page = parseInt(req.query.page) || 0;
    const size = parseInt(req.query.size) || 10;

    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required!" });
        }

        const totalBookings = await prisma.booking.count({
            where: { userId:userId }
        });

        const bookings = await prisma.booking.findMany({
            where: { userId },
            include: {
                room: {
                    select: { name: true },
                },
            },
            orderBy: { startTime: "asc" },
            skip: ((page-1)*size),
            take: size,
        });

        const totalPages = Math.ceil(totalBookings / size);

        return res.status(200).json({bookings,totalBookings,currentPage:parseInt(page), totalPages});

    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};


export const updateBooking = async (req, res) => {
    try {
        const { title, description, startTime, endTime } = req.body;
        const { bookingId } = req.params;

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start.getTime() === end.getTime()) {
            return res.status(400).json({ message: "Start and End Time can't be the same!" });
        } else if (start.getTime() > end.getTime()) {
            return res.status(400).json({ message: "End time must be after the start time" });
        }

        if (!bookingId || !title || !startTime || !endTime) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: "Invalid date format. Use ISO 8601 format." });
        }

        // Check if booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        // Check for booking conflicts only if the time is being updated
        let conflictBooking = null;
        if (startTime !== existingBooking.startTime || endTime !== existingBooking.endTime) {
            conflictBooking = await prisma.booking.findFirst({
                where: {
                    roomId: existingBooking.roomId, // Keep the same roomId as the existing booking
                    AND: [
                        { startTime: { lte: end } },
                        { endTime: { gte: start } },
                        { NOT: { id: bookingId } }, // Ensure it doesn't check the booking itself
                    ]
                }
            });
        }

        if (conflictBooking) {
            return res.status(400).json({ message: "Room is already booked for this time!" });
        }

        // Proceed to update the booking
        const updatedBooking = await prisma.booking.update({
            where: { id: bookingId },
            data: {
                title,
                description,
                startTime: start,
                endTime: end,
            }
        });

        res.status(200).json(updatedBooking);

    } catch (error) {
        console.error("Error updating booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({ error: "Booking ID is required!" });
        }

        // Check if the booking exists
        const existingBooking = await prisma.booking.findUnique({
            where: { id: bookingId },
        });

        if (!existingBooking) {
            return res.status(404).json({ message: "Booking not found!" });
        }

        // Delete the booking
        await prisma.booking.delete({
            where: { id: bookingId },
        });

        res.status(200).json({ message: "Booking deleted successfully!" });

    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



