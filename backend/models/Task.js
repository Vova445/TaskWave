import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxLength: 500
  },
  priority: String,
  deadline: String,
  executionTime: String,
  repetition: String,
  colorMarking: String,
  icon: String,
  reminder: String,
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);