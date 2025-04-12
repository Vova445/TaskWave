export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: 'Високий' | 'Середній' | 'Низький';
  deadline?: string;
  executionTime?: string;
  reminder?: string;
  colorMarking?: string;
  icon?: string;
  isCompleted: boolean;
}

export interface ReminderOption {
  value: string;
  label: string;
}

export interface TaskItemProps {
  item: Task;
  isDarkMode: boolean;
  styles: any; // You can define specific styles interface if needed
  onComplete: (task: Task) => void;
  onDelete: (task: Task) => void;
  onEdit: (task: Task) => void;
  reminderOptions: ReminderOption[];
}