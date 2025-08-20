export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
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
  updatedAt: Date;
}
