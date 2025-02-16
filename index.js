import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();


import roomRoutes from "./server/routes/roomRoutes.js"; 
import bookingRoutes from "./server/routes/bookingRoutes.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://room-booking-next.vercel.app',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Root route
app.use("/api/rooms", roomRoutes); 
app.use("/api/bookings", bookingRoutes);

app.get('/', (req, res) => {
  res.send('Hello to online API');
});

// Start server and connect to the database
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));