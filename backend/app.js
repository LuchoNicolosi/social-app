import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let type = req.url.split('/')[4];
    if (type === 'signup') {
      type = 'imageProfile';
    } else if (type === 'post') {
      type = 'imagePost';
    } else {
      const error = new Error('Image destination type error!.');
      error.statusCode = 404;
      throw error;
    }
    let path = `./images/${type}`;

    cb(null, path);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, 'images'))); //static images

app.use(
  multer({ storage: storage, fileFilter: fileFilter }).single('imageUrl')
);

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
