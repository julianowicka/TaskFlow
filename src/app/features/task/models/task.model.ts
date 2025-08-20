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
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
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
  createdAt: Date;
  updatedAt?: Date;
}
