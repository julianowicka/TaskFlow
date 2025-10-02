import { Injectable, computed, effect, signal } from '@angular/core';
import { Board, BoardSummary } from '../models/board.model';

@Injectable({
  providedIn: 'root',
})
export class BoardStore {
  // State
  private boards = signal<Board[]>([]);
  private selectedBoardId = signal<string | null>(null);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Selectors (computed values)
  readonly allBoards = computed(() => this.boards());
  readonly selectedBoard = computed(() => {
    const id = this.selectedBoardId();
    return id ? this.boards().find((board) => board.id === id) || null : null;
  });
  readonly boardSummaries = computed(() => {
    return this.boards().map((board) => {
      // This is a placeholder. In a real app, you would compute these values
      // based on the actual columns and tasks
      return {
        id: board.id,
        title: board.title,
        description: board.description,
        columnCount: board.columnOrder.length,
        taskCount: 0, // This would be calculated from tasks in columns
        updatedAt: board.updatedAt,
      } as BoardSummary;
    });
  });
  readonly isLoading = computed(() => this.loading());
  readonly errorMessage = computed(() => this.error());

  constructor() {
    // Initialize from localStorage if available
    this.loadFromLocalStorage();

    // Save to localStorage whenever state changes
    effect(() => {
      this.saveToLocalStorage();
    });
  }

  // Actions
  loadBoards(): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      // In a real app, this would be an API call
      // For now, we're just using the data from localStorage
      // No need to do anything here since we loaded in the constructor

      // If no boards exist, create some test data
      if (this.boards().length === 0) {
        this.createTestData();
      }

      // Simulate API delay
      setTimeout(() => {
        this.loading.set(false);
      }, 500);
    } catch (err) {
      this.error.set('Failed to load boards');
      this.loading.set(false);
    }
  }

  createBoard(title: string, description?: string): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      const newBoard: Board = {
        id: crypto.randomUUID(),
        title,
        description,
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: 'current-user', // In a real app, this would be the current user's ID
        isArchived: false,
        columnOrder: [],
      };

      this.boards.update((boards) => [...boards, newBoard]);
      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to create board');
      this.loading.set(false);
    }
  }

  updateBoard(id: string, updates: Partial<Board>): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.boards.update((boards) =>
        boards.map((board) =>
          board.id === id ? { ...board, ...updates, updatedAt: new Date() } : board,
        ),
      );
      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to update board');
      this.loading.set(false);
    }
  }

  updateColumnOrder(boardId: string, columnOrder: string[]): void {
    this.boards.update((boards) =>
      boards.map((board) =>
        board.id === boardId ? { ...board, columnOrder, updatedAt: new Date() } : board,
      ),
    );
  }

  deleteBoard(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      this.boards.update((boards) => boards.filter((board) => board.id !== id));

      // If the deleted board was selected, clear the selection
      if (this.selectedBoardId() === id) {
        this.selectedBoardId.set(null);
      }

      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to delete board');
      this.loading.set(false);
    }
  }

  selectBoard(id: string | null): void {
    this.selectedBoardId.set(id);
  }

  // Local storage methods
  private loadFromLocalStorage(): void {
    try {
      const storedBoards = localStorage.getItem('taskflow_boards');
      if (storedBoards) {
        const parsedBoards = JSON.parse(storedBoards);

        // Convert string dates back to Date objects
        const boards = parsedBoards.map((board: any) => ({
          ...board,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt),
        }));

        this.boards.set(boards);
      }

      const selectedId = localStorage.getItem('taskflow_selected_board');
      if (selectedId) {
        this.selectedBoardId.set(selectedId);
      }
    } catch (err) {
      console.error('Failed to load boards from localStorage', err);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('taskflow_boards', JSON.stringify(this.boards()));

      const selectedId = this.selectedBoardId();
      if (selectedId) {
        localStorage.setItem('taskflow_selected_board', selectedId);
      } else {
        localStorage.removeItem('taskflow_selected_board');
      }
    } catch (err) {
      console.error('Failed to save boards to localStorage', err);
    }
  }

  // Create test data for development
  private createTestData(): void {
    const testBoard: Board = {
      id: 'board-1',
      title: 'Project Alpha',
      description: 'Main development board for the new application',
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: 'current-user',
      isArchived: false,
      columnOrder: ['col-1', 'col-2', 'col-3'],
    };

    this.boards.set([testBoard]);
    this.selectedBoardId.set('board-1');
  }
}
