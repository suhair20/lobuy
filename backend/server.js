import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoute from './routes/userRoutes.js';
import AdminRoute from './routes/AdminRoutes.js'

import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  
  origin:'http://localhost:5173',  
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// app.use(cors({
  
//   origin:'https://lobuy.vercel.app',
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

app.use(express.json());
app.use(cookieParser());
// ✅ Correct route path
app.use('/api/user', userRoute);
app.use('/api/admin',AdminRoute) // <-- note singular to match your frontend

app.get('/', (req, res) => {
  res.send('Server is running...');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
  });

