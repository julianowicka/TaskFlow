import { Injectable, computed, effect, signal } from '@angular/core';
import { Column } from '../models/column.model';
import { BoardStore } from '../../board/services/board.store';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnStore {
  // State
  private columns = signal<Column[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Selectors (computed values)
  readonly allColumns = computed(() => this.columns());
  readonly columnsByBoard = computed(() => {
    const selectedBoard = this.boardStore.selectedBoard();
    if (!selectedBoard) return [];

    const boardColumns = this.columns().filter((column) => column.boardId === selectedBoard.id);

    // Sort columns according to the board's columnOrder
    return selectedBoard.columnOrder
      .map((columnId) => boardColumns.find((column) => column.id === columnId))
      .filter((column): column is Column => !!column);
  });
  readonly isLoading = computed(() => this.loading());
  readonly errorMessage = computed(() => this.error());

  constructor(
    private boardStore: BoardStore,
    private apiService: ApiService,
  ) {
    // Initialize from localStorage if available
    this.loadFromLocalStorage();

    // Save to localStorage whenever state changes
    effect(() => {
      this.saveToLocalStorage();
    });
  }

  // Actions
  loadColumns(boardId: string): void {
    this.loading.set(true);
    this.error.set(null);

    // Simulate API call
    setTimeout(() => {
      // Create test data if none exists for this board
      const existingColumns = this.columns().filter((col) => col.boardId === boardId);
      if (existingColumns.length === 0) {
        this.createTestData(boardId);
      }
      this.loading.set(false);
    }, 300);
  }

  createColumn(boardId: string, title: string, color?: string): void {
    this.loading.set(true);
    this.error.set(null);

    const newColumn: Column = {
      id: `col-${Date.now()}`,
      title,
      boardId,
      taskIds: [],
      position: this.columns().filter((col) => col.boardId === boardId).length,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: color || '#3b82f6',
    };

    // Simulate API call
    setTimeout(() => {
      this.columns.update((columns) => [...columns, newColumn]);

      // Update the board's columnOrder
      const board = this.boardStore.selectedBoard();
      if (board) {
        this.boardStore.updateColumnOrder(boardId, [...board.columnOrder, newColumn.id]);
      }

      this.loading.set(false);
    }, 300);
  }

  updateColumn(id: string, updates: Partial<Column>): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.columns.update((columns) =>
        columns.map((column) =>
          column.id === id
            ? { ...column, ...updates, updatedAt: new Date().toISOString() }
            : column,
        ),
      );
      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to update column');
      this.loading.set(false);
    }
  }

  updateTaskOrder(columnId: string, taskIds: string[]): void {
    this.columns.update((columns) =>
      columns.map((column) =>
        column.id === columnId
          ? { ...column, taskIds, updatedAt: new Date().toISOString() }
          : column,
      ),
    );
  }

  deleteColumn(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Get the column to delete
      const columnToDelete = this.columns().find((column) => column.id === id);
      if (!columnToDelete) {
        this.error.set('Column not found');
        this.loading.set(false);
        return;
      }

      // Remove the column
      this.columns.update((columns) => columns.filter((column) => column.id !== id));

      // Update the board's columnOrder
      const board = this.boardStore.selectedBoard();
      if (board) {
        this.boardStore.updateColumnOrder(
          columnToDelete.boardId,
          board.columnOrder.filter((columnId) => columnId !== id),
        );
      }

      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to delete column');
      this.loading.set(false);
    }
  }

  moveTask(
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number,
  ): void {
    const columns = this.columns();
    const sourceColumn = columns.find((column) => column.id === sourceColumnId);
    const destinationColumn = columns.find((column) => column.id === destinationColumnId);

    if (!sourceColumn || !destinationColumn) {
      this.error.set('Source or destination column not found');
      return;
    }

    // Remove task from source column
    const newSourceTaskIds = sourceColumn.taskIds.filter((id) => id !== taskId);

    // Add task to destination column at the specified index
    const newDestinationTaskIds = [...destinationColumn.taskIds];
    newDestinationTaskIds.splice(newIndex, 0, taskId);

    // Update both columns
    this.columns.update((columns) =>
      columns.map((column) => {
        if (column.id === sourceColumnId) {
          return { ...column, taskIds: newSourceTaskIds, updatedAt: new Date().toISOString() };
        }
        if (column.id === destinationColumnId) {
          return { ...column, taskIds: newDestinationTaskIds, updatedAt: new Date().toISOString() };
        }
        return column;
      }),
    );
  }

  // Create test data for development
  private createTestData(boardId: string): void {
    const testColumns: Column[] = [
      {
        id: 'col-1',
        title: 'To Do',
        boardId,
        taskIds: ['task-1', 'task-2', 'task-3'],
        position: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: '#3b82f6',
      },
      {
        id: 'col-2',
        title: 'In Progress',
        boardId,
        taskIds: ['task-4', 'task-5'],
        position: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: '#f59e0b',
      },
      {
        id: 'col-3',
        title: 'Done',
        boardId,
        taskIds: ['task-6'],
        position: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        color: '#10b981',
      },
    ];

    this.columns.set(testColumns);
  }

  // Local storage methods
  private loadFromLocalStorage(): void {
    try {
      const storedColumns = localStorage.getItem('taskflow_columns');
      if (storedColumns) {
        const parsedColumns = JSON.parse(storedColumns);

        // Keep dates as strings for API compatibility
        const columns = parsedColumns;

        this.columns.set(columns);
      }
    } catch (err) {
      console.error('Failed to load columns from localStorage', err);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('taskflow_columns', JSON.stringify(this.columns()));
    } catch (err) {
      console.error('Failed to save columns to localStorage', err);
    }
  }
}
