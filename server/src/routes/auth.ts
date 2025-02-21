import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'infiniteforever';

// console.log('JWT Secret:', JWT_SECRET);

router.use(cors());

// Login Route
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid Credentials!" });
            return;
        }

        // Compare provided password with stored hash
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
            res.status(401).json({ success: false, message: "Invalid Credentials!" });
            return;
        }

        // Sign the JWT
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        if (!token) {
            res.status(500).json({ success: false, message: "Token generation failed" });
            return;
        }

        res.json({ success: true, data: token });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Login Error!" });
    }
});

router.post('/register', async (req: Request, res: Response): Promise<void>  => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ success: false, message: "Missing fields" });
        return;
    }

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ success: false, message: "User already exists." });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });

        // Sign the JWT
        const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({  success: true, data: token });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false, message: "Server Registration Error!" });
    }
})

export default router;