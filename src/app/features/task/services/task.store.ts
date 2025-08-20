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

      // Simulate API delay
      setTimeout(() => {
        this.loading.set(false);
      }, 500);
    } catch (err) {
      this.error.set('Failed to load tasks');
      this.loading.set(false);
    }
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
