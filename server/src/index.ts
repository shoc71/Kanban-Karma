import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import apiRoutes from './routes/index'; 
import { errorHandler } from './middleware/errorHandler';
import { fileURLToPath } from 'url';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fileName)

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ 
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true 
}));

// Public Routes & Protected API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', apiRoutes);

// Catch-all: for any route not matching API, serve React's index.html

if (process.env.NODE_ENV === 'production') {
  console.log('production')
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  })
}

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})

export default server;