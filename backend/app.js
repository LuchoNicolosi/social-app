import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import multer from 'multer';
import { SocketServer } from './socket.js';
import http from 'http';
import morgan from 'morgan';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = SocketServer.init(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

app.use(cors());
app.use(express.json());

app.use(multer({ storage: multer.diskStorage({}) }).single('imageUrl'));

app.use('/api/v1', routes);

app.use(morgan('combined'));

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ errorMessage: message, data: data });
});

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    server.listen(process.env.PORT || 8080, () => {
      console.log('Server running!!');
    });
    io.on('connection', (socket) => {
      console.log('user connected!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
