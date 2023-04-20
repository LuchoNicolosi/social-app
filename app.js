import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', routes);

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
