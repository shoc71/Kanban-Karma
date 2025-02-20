import express from 'express';
import taskRoutes from './taskRoutes';
import boardRoutes from './boardRoutes';

const router = express.Router();

// Protected Routes
router.use('/tasks', taskRoutes);
router.use('/boards', boardRoutes);

export default router;