export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string; // Changed to string for API compatibility
  updatedAt: string; // Changed to string for API compatibility
  ownerId: string;
  isArchived: boolean;
  columnOrder: string[]; // Array of column IDs in their display order
}

export interface BoardSummary {
  id: string;
  title: string;
  description?: string;
  columnCount: number;
  taskCount: number;
  updatedAt: string; // Changed to string for API compatibility
}
