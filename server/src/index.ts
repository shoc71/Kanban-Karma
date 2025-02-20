import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import apiRoutes from './routes/index'; // Import the secured API routes
import { errorHandler } from './middleware/errorHandler';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Public Routes & Protected API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`)
})