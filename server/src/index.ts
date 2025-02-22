import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import apiRoutes from './routes/index'; // Import the secured API routes
import { errorHandler } from './middleware/errorHandler';
import cors from 'cors';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../../client/build')));

// Catch-all: for any route not matching API, serve React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// Public Routes & Protected API Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', apiRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})

export default server;