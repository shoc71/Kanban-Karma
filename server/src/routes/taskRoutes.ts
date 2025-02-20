import express, {Request, Response, NextFunction} from 'express';
import prisma from '../db/prisma';
import { AuthenticatedRequest, authenticateToken } from '../middleware/auth';

const router = express.Router();

// Get all tasks for the logged-in user
router.get('/', authenticateToken, async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction): Promise<void> => {
    try {
        const tasks = await prisma.task.findMany({
            where: { userId: req.user!.userId }, // Only fetch tasks belonging to the authenticated user
        });

        res.status(200).json({ success: true, data: tasks});

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching Tasks" });
    }
});

// Create a new task
router.post('/', authenticateToken, async (
  req: AuthenticatedRequest,
  res: Response, next:
    NextFunction): Promise<void> => {
  const { title, boardId } = req.body;

  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        boardId,
        userId: req.user!.userId, // Assign the task to the authenticated user
      },
    });

    res.status(201).json( {success: true, data: newTask});
  } catch (error) {
    res.status(500).json({success: false,message: 'Error creating task' });
  }
});

// Update a task
router.put('/:id', authenticateToken, async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title, status } = req.body;

  try {
    const updatedTask = await prisma.task.updateMany({
      where: {
        id,
        userId: req.user!.userId, // Ensure user owns the task
      },
      data: { title, status },
    });

    if (updatedTask.count === 0) {
      res.status(403).json({ success: false, message: 'Not authorized to update this task' });
      return;
    }

    res.status(202).json({ success: true,message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', authenticateToken, async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedTask = await prisma.task.deleteMany({
      where: {
        id,
        userId: req.user!.userId, // Ensure user owns the task
      },
    });

    if (deletedTask.count === 0) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
      return;
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting task' });
  }
});

export default router;