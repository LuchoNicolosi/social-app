import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';

import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
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
app.use(multer({ storage: storage, fileFilter: fileFilter }).single('image'));
app.use('/api/v1', routes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(statusCode).json({ errorMessage: message, data: data });
});

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    app.listen(8080, () => {
      console.log('Server running!!');
    });
  })
  .catch((err) => {
    console.log(err);
  });
