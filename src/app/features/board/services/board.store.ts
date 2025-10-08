import { Injectable, computed, effect, signal } from '@angular/core';
import { Board, BoardSummary } from '../models/board.model';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

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

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
  ) {
    // Initialize from localStorage if available
    this.loadFromLocalStorage();

    // Save to localStorage whenever state changes
    effect(() => {
      this.saveToLocalStorage();
    });
  }

  // Actions
  loadBoards(ownerId = 'current-user'): void {
    this.loading.set(true);
    this.error.set(null);

    // Simulate API call with timeout
    setTimeout(() => {
      // Create some sample boards if none exist
      if (this.boards().length === 0) {
        this.createTestData();
      }
      this.loading.set(false);
    }, 500);
  }

  createBoard(title: string, description?: string): void {
    this.loading.set(true);
    this.error.set(null);

    const newBoard: Board = {
      id: `board-${Date.now()}`,
      title,
      description,
      ownerId: 'current-user',
      isArchived: false,
      columnOrder: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Simulate API call
    setTimeout(() => {
      this.boards.update((boards) => [...boards, newBoard]);
      this.loading.set(false);
      this.notificationService.success('Success', 'Board created successfully');
    }, 300);
  }

  updateBoard(id: string, updates: Partial<Board>): void {
    this.loading.set(true);
    this.error.set(null);

    // Simulate API call
    setTimeout(() => {
      this.boards.update((boards) =>
        boards.map((b) =>
          b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b,
        ),
      );
      this.loading.set(false);
    }, 300);
  }

  updateColumnOrder(boardId: string, columnOrder: string[]): void {
    // Simulate API call
    setTimeout(() => {
      this.boards.update((boards) =>
        boards.map((b) =>
          b.id === boardId ? { ...b, columnOrder, updatedAt: new Date().toISOString() } : b,
        ),
      );
    }, 300);
  }

  deleteBoard(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    // Simulate API call
    setTimeout(() => {
      this.boards.update((boards) => boards.filter((board) => board.id !== id));

      // If the deleted board was selected, clear the selection
      if (this.selectedBoardId() === id) {
        this.selectedBoardId.set(null);
      }

      this.loading.set(false);
      this.notificationService.success('Success', 'Board deleted successfully');
    }, 300);
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

        // Keep dates as strings for API compatibility
        const boards = parsedBoards;

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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ownerId: 'current-user',
      isArchived: false,
      columnOrder: ['col-1', 'col-2', 'col-3'],
    };

    this.boards.set([testBoard]);
    this.selectedBoardId.set('board-1');
  }
}
