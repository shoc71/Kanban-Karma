import express, { NextFunction, Request, Response } from 'express';
import prisma from '../db/prisma';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// Get all boards for the logged-in user
router.get('/', authenticateToken, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction): Promise<void> => {
  try {
    const boards = await prisma.board.findMany({
      where: { userId: req.user!.userId },
    });

    res.status(200).json({success:true, data: boards});
  } catch (error) {
    res.status(500).json({success: false, message: 'Error fetching boards' });
  }
});

// Create a new board
router.post('/', authenticateToken, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction): Promise<void> => {
  const { title } = req.body;

  try {
    const newBoard = await prisma.board.create({
      data: {
        title,
        userId: req.user!.userId,
      },
    });

    res.status(201).json({success: true, data: newBoard});
  } catch (error) {
    res.status(500).json({succes: false,  message: 'Error creating board' });
  }
});

// Update a board
router.put('/:id', authenticateToken, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    const updatedBoard = await prisma.board.updateMany({
      where: {
        id,
        userId: req.user!.userId, // Ensure user owns the board
      },
      data: { title },
    });

    if (updatedBoard.count === 0) {
      res.status(403).json({ success: false, message: 'Not authorized to update this board' });
        return;
    }

    res.status(202).json({ success: true, message: 'Board updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating board' });
  }
});

// Delete a board
router.delete('/:id', authenticateToken, async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction): Promise<void> => {
  const { id } = req.params;

  try {
    const deletedBoard = await prisma.board.deleteMany({
      where: {
        id,
        userId: req.user!.userId, // Ensure user owns the board
      },
    });

    if (deletedBoard.count === 0) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this board' });
        return;
    }

    res.status(200).json({ success: true, message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting board' });
  }
});

export default router;
