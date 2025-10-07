export interface Column {
  id: string;
  title: string;
  boardId: string;
  taskIds: string[]; // Array of task IDs in their display order
  position: number; // Added position field
  createdAt: string; // Changed to string for API compatibility
  updatedAt: string; // Changed to string for API compatibility
  limit?: number; // Optional WIP limit
  color?: string; // Optional color for the column
}
