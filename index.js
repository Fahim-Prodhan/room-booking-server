import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './server/DB/databaseConfigs.js';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
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

// Derive __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root route
app.get('/', (req, res) => {
  res.send('Hello to online API');
});

// Start server and connect to the database
app.listen(PORT, () => {
  connectDB().catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); // Exit the process with a failure code if DB connection fails
  });
  console.log(`Server Running on port ${PORT}`);
});
