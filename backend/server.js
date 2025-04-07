import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

import profileRoutes from './routes/profileRoutes.js';


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/profile', profileRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Підключено до MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Сервер запущено на порту ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB помилка:', err.message);
  });
