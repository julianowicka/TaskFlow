import { Injectable, computed, effect, signal } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../models/task.model';
import { ColumnStore } from '../../column/services/column.store';

@Injectable({
  providedIn: 'root',
})
export class TaskStore {
  // State
  private tasks = signal<Task[]>([]);
  private selectedTaskId = signal<string | null>(null);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Selectors (computed values)
  readonly allTasks = computed(() => this.tasks());
  readonly selectedTask = computed(() => {
    const id = this.selectedTaskId();
    return id ? this.tasks().find((task) => task.id === id) || null : null;
  });
  readonly tasksByColumn = computed(() => {
    const columns = this.columnStore.columnsByBoard();
    const result: Record<string, Task[]> = {};

    columns.forEach((column) => {
      // Get tasks for this column and sort them according to the column's taskIds
      const columnTasks = this.tasks()
        .filter((task) => task.columnId === column.id)
        .sort((a, b) => {
          const aIndex = column.taskIds.indexOf(a.id);
          const bIndex = column.taskIds.indexOf(b.id);
          return aIndex - bIndex;
        });

      result[column.id] = columnTasks;
    });

    return result;
  });
  readonly isLoading = computed(() => this.loading());
  readonly errorMessage = computed(() => this.error());

  constructor(private columnStore: ColumnStore) {
    // Initialize from localStorage if available
    this.loadFromLocalStorage();

    // Save to localStorage whenever state changes
    effect(() => {
      this.saveToLocalStorage();
    });
  }

  // Actions
  loadTasks(boardId: string): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      // In a real app, this would be an API call
      // For now, we're just using the data from localStorage
      // No need to do anything here since we loaded in the constructor

      // If no tasks exist, create some test data
      if (this.tasks().length === 0) {
        this.createTestData(boardId);
      }

      // Simulate API delay
      setTimeout(() => {
        this.loading.set(false);
      }, 500);
    } catch (err) {
      this.error.set('Failed to load tasks');
      this.loading.set(false);
    }
  }

  // Create test data for development
  private createTestData(boardId: string): void {
    const testTasks: Task[] = [
      {
        id: 'task-1',
        title: 'Design user interface',
        description: 'Create wireframes and mockups for the new dashboard',
        columnId: 'col-1',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'high',
        status: 'todo',
        labels: [
          { id: 'label-1', name: 'Design', color: '#3b82f6' },
          { id: 'label-2', name: 'UI/UX', color: '#8b5cf6' },
        ],
        checklist: [
          { id: '1', text: 'Create wireframes', isCompleted: false, createdAt: new Date() },
          { id: '2', text: 'Design mockups', isCompleted: false, createdAt: new Date() },
        ],
      },
      {
        id: 'task-2',
        title: 'Set up development environment',
        description: 'Install and configure all necessary development tools',
        columnId: 'col-1',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        status: 'todo',
        labels: [{ id: 'label-3', name: 'Setup', color: '#10b981' }],
        checklist: [],
      },
      {
        id: 'task-3',
        title: 'Write API documentation',
        description: 'Document all API endpoints and their usage',
        columnId: 'col-1',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'low',
        status: 'todo',
        labels: [{ id: 'label-4', name: 'Documentation', color: '#f59e0b' }],
        checklist: [],
      },
      {
        id: 'task-4',
        title: 'Implement authentication',
        description: 'Build login and registration system',
        columnId: 'col-2',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'high',
        status: 'in-progress',
        labels: [
          { id: 'label-5', name: 'Backend', color: '#ef4444' },
          { id: 'label-6', name: 'Security', color: '#8b5cf6' },
        ],
        checklist: [
          { id: '1', text: 'Set up JWT tokens', isCompleted: true, createdAt: new Date() },
          { id: '2', text: 'Implement login endpoint', isCompleted: false, createdAt: new Date() },
        ],
      },
      {
        id: 'task-5',
        title: 'Create database schema',
        description: 'Design and implement the database structure',
        columnId: 'col-2',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        status: 'in-progress',
        labels: [{ id: 'label-7', name: 'Database', color: '#06b6d4' }],
        checklist: [],
      },
      {
        id: 'task-6',
        title: 'Project setup',
        description: 'Initialize the project structure and basic configuration',
        columnId: 'col-3',
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority: 'medium',
        status: 'done',
        labels: [{ id: 'label-8', name: 'Setup', color: '#10b981' }],
        checklist: [
          { id: '1', text: 'Create project structure', isCompleted: true, createdAt: new Date() },
          { id: '2', text: 'Configure build tools', isCompleted: true, createdAt: new Date() },
        ],
      },
    ];

    this.tasks.set(testTasks);
  }

  createTask(
    columnId: string,
    boardId: string,
    title: string,
    description?: string,
    priority: TaskPriority = 'medium',
    status: TaskStatus = 'todo',
  ): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        columnId,
        boardId,
        createdAt: new Date(),
        updatedAt: new Date(),
        priority,
        status,
        labels: [],
        checklist: [],
      };

      this.tasks.update((tasks) => [...tasks, newTask]);

      // Update the column's taskIds
      const columns = this.columnStore.allColumns();
      const column = columns.find((col) => col.id === columnId);

      if (column) {
        this.columnStore.updateTaskOrder(columnId, [...column.taskIds, newTask.id]);
      }

      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to create task');
      this.loading.set(false);
    }
  }

  updateTask(id: string, updates: Partial<Task>): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      const task = this.tasks().find((t) => t.id === id);
      if (!task) {
        this.error.set('Task not found');
        this.loading.set(false);
        return;
      }

      // If the column is changing, we need to update both columns' taskIds
      if (updates.columnId && updates.columnId !== task.columnId) {
        const oldColumnId = task.columnId;
        const newColumnId = updates.columnId;

        // Get the columns
        const columns = this.columnStore.allColumns();
        const oldColumn = columns.find((col) => col.id === oldColumnId);
        const newColumn = columns.find((col) => col.id === newColumnId);

        if (oldColumn && newColumn) {
          // Remove from old column
          this.columnStore.updateTaskOrder(
            oldColumnId,
            oldColumn.taskIds.filter((taskId) => taskId !== id),
          );

          // Add to new column
          this.columnStore.updateTaskOrder(newColumnId, [...newColumn.taskIds, id]);
        }
      }

      // Update the task
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task,
        ),
      );

      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to update task');
      this.loading.set(false);
    }
  }

  deleteTask(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    try {
      // Get the task to delete
      const taskToDelete = this.tasks().find((task) => task.id === id);
      if (!taskToDelete) {
        this.error.set('Task not found');
        this.loading.set(false);
        return;
      }

      // Remove the task
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== id));

      // Update the column's taskIds
      const columns = this.columnStore.allColumns();
      const column = columns.find((col) => col.id === taskToDelete.columnId);

      if (column) {
        this.columnStore.updateTaskOrder(
          taskToDelete.columnId,
          column.taskIds.filter((taskId) => taskId !== id),
        );
      }

      // If the deleted task was selected, clear the selection
      if (this.selectedTaskId() === id) {
        this.selectedTaskId.set(null);
      }

      this.loading.set(false);
    } catch (err) {
      this.error.set('Failed to delete task');
      this.loading.set(false);
    }
  }

  selectTask(id: string | null): void {
    this.selectedTaskId.set(id);
  }

  addChecklistItem(taskId: string, text: string): void {
    const task = this.tasks().find((t) => t.id === taskId);
    if (!task) return;

    const newItem = {
      id: crypto.randomUUID(),
      text,
      isCompleted: false,
      createdAt: new Date(),
    };

    this.updateTask(taskId, {
      checklist: [...task.checklist, newItem],
    });
  }

  updateChecklistItem(taskId: string, itemId: string, isCompleted: boolean): void {
    const task = this.tasks().find((t) => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId ? { ...item, isCompleted } : item,
    );

    this.updateTask(taskId, { checklist: updatedChecklist });
  }

  deleteChecklistItem(taskId: string, itemId: string): void {
    const task = this.tasks().find((t) => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.filter((item) => item.id !== itemId);

    this.updateTask(taskId, { checklist: updatedChecklist });
  }

  // Drag & Drop methods
  reorderTasksInColumn(columnId: string, previousIndex: number, currentIndex: number): void {
    const columns = this.columnStore.allColumns();
    const column = columns.find((col) => col.id === columnId);

    if (!column) return;

    const taskIds = [...column.taskIds];
    const [movedTaskId] = taskIds.splice(previousIndex, 1);
    taskIds.splice(currentIndex, 0, movedTaskId);

    this.columnStore.updateTaskOrder(columnId, taskIds);
  }

  moveTaskToColumn(
    taskId: string,
    previousColumnId: string,
    newColumnId: string,
    newIndex: number,
  ): void {
    const columns = this.columnStore.allColumns();
    const previousColumn = columns.find((col) => col.id === previousColumnId);
    const newColumn = columns.find((col) => col.id === newColumnId);

    if (!previousColumn || !newColumn) return;

    // Remove from previous column
    const previousTaskIds = previousColumn.taskIds.filter((id) => id !== taskId);
    this.columnStore.updateTaskOrder(previousColumnId, previousTaskIds);

    // Add to new column at specific position
    const newTaskIds = [...newColumn.taskIds];
    newTaskIds.splice(newIndex, 0, taskId);
    this.columnStore.updateTaskOrder(newColumnId, newTaskIds);

    // Update task's columnId
    this.updateTask(taskId, { columnId: newColumnId });
  }

  // Local storage methods
  private loadFromLocalStorage(): void {
    try {
      const storedTasks = localStorage.getItem('taskflow_tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);

        // Convert string dates back to Date objects
        const tasks = parsedTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          checklist: task.checklist.map((item: any) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          })),
          comments: task.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
            updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined,
          })),
        }));

        this.tasks.set(tasks);
      }

      const selectedId = localStorage.getItem('taskflow_selected_task');
      if (selectedId) {
        this.selectedTaskId.set(selectedId);
      }
    } catch (err) {
      console.error('Failed to load tasks from localStorage', err);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks()));

      const selectedId = this.selectedTaskId();
      if (selectedId) {
        localStorage.setItem('taskflow_selected_task', selectedId);
      } else {
        localStorage.removeItem('taskflow_selected_task');
      }
    } catch (err) {
      console.error('Failed to save tasks to localStorage', err);
    }
  }
}
