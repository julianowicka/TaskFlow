export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export interface TaskLabel {
  id: string;
  name: string;
  color: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string; // Changed to string for API compatibility
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  createdAt: string; // Changed to string for API compatibility
  updatedAt: string; // Changed to string for API compatibility
  dueDate?: string; // Changed to string for API compatibility
  assigneeId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  labels: TaskLabel[];
  checklist: ChecklistItem[];
  attachments?: string[]; // Array of attachment URLs or IDs
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string; // Changed to string for API compatibility
  updatedAt?: string; // Changed to string for API compatibility
}
