import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import v1 from "./src/routes/v1";
import { setupSocket } from './src/services/socketService';
import cors from 'cors';
import dotenv from "dotenv";
import connectDB from "./src/config/db";


dotenv.config({
  path: ".env"
});
connectDB();

const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

setupSocket(io); // Initialize your socket setup

app.use(cors({ origin: '*' }));
app.use(express.json());

app.use("/api/v1", (req, res, next) => {
  next()
}, v1);

const PORT = 4000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
