export interface Column {
  id: string;
  title: string;
  boardId: string;
  taskIds: string[]; // Array of task IDs in their display order
  createdAt: Date;
  updatedAt: Date;
  limit?: number; // Optional WIP limit
  color?: string; // Optional color for the column
}
