import express from 'express';
import taskRoutes from './taskRoutes.js';
import boardRoutes from './boardRoutes.js';

const router = express.Router();

// Protected Routes
router.use('/tasks', taskRoutes);
router.use('/boards', boardRoutes);

export default router;