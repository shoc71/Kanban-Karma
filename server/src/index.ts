import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth';
import apiRoutes from './routes/index'; 
import { errorHandler } from './middleware/errorHandler';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// const CLIENT_URL = process.env.CLIENT_URL || `http://localhost:5173`;
app.use(cors({ origin: `http://localhost:${PORT}`, credentials: true }));

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../../client/build')));

// Public Routes & Protected API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', apiRoutes);

// Catch-all: for any route not matching API, serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});


app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})

export default server;