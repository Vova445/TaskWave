import jwt from 'jsonwebtoken';
import { Task } from '../models/Task.js';

// Get all tasks for user
export const getTasks = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Немає токену' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const tasks = await Task.find({ userId: decoded.id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(401).json({ message: 'Недійсний токен' });
  }
};

// Create new task
export const createTask = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Немає токену' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const taskData = { ...req.body, userId: decoded.id };
    
    const task = new Task(taskData);
    await task.save();
    
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};