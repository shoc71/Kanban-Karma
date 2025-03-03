import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import apiRoutes from './routes/index.js'; 
import { errorHandler } from './middleware/errorHandler.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

console.log("Running in production with __dirname:", __dirname);
console.log("PORT from process.env:", process.env.PORT);

const API_BASE_URL = process.env.FRONTEND_URL;
fetch(`${API_BASE_URL}/api/auth/login`);
console.log(API_BASE_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Public Routes & Protected API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Catch-all: for any route not matching API, serve React's index.html

if (process.env.NODE_ENV === 'production') {
  console.log('production')
  const clientBuildPath = path.resolve(__dirname, '..', '..', 'client', 'dist');
  console.log("Client build path:", clientBuildPath);
  app.use(express.static(clientBuildPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  })
}

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})

export default server;