import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Column } from '../../models/column.model';
import { Task } from '../../../task/models/task.model';
import { ColumnStore } from '../../services/column.store';
import { TaskStore } from '../../../task/services/task.store';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { TaskCardComponent } from '../../../task/components/task-card/task-card.component';

@Component({
  selector: 'app-column',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    CardComponent,
    ButtonComponent,
    IconComponent,
    TaskCardComponent,
  ],
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss'],
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tasks: Task[] = [];
  @Input() dropListIds: string[] = [];

  isEditingTitle = false;
  editableTitle = '';

  isAddingTask = false;
  newTaskTitle = '';

  constructor(
    private columnStore: ColumnStore,
    private taskStore: TaskStore,
  ) {}

  startEditingTitle(): void {
    this.editableTitle = this.column.title;
    this.isEditingTitle = true;
    setTimeout(() => {
      const input = document.querySelector('.column-title-input') as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  saveColumnTitle(): void {
    if (this.editableTitle.trim() && this.editableTitle !== this.column.title) {
      this.columnStore.updateColumn(this.column.id, { title: this.editableTitle.trim() });
    }
    this.isEditingTitle = false;
  }

  openColumnMenu(): void {
    // This will be implemented with a dropdown menu
    console.log('Open column menu');
  }

  startAddingTask(): void {
    this.isAddingTask = true;
    this.newTaskTitle = '';
    setTimeout(() => {
      const input = document.querySelector('.task-title-input') as HTMLTextAreaElement;
      input?.focus();
    }, 0);
  }

  addTask(): void {
    if (this.newTaskTitle.trim()) {
      this.taskStore.createTask(this.column.id, this.column.boardId, this.newTaskTitle.trim());
      this.cancelAddTask();
    }
  }

  cancelAddTask(): void {
    this.isAddingTask = false;
    this.newTaskTitle = '';
  }

  openTaskDetail(taskId: string): void {
    this.taskStore.selectTask(taskId);
    // This will be implemented with a modal or navigation
    console.log('Open task detail', taskId);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      this.taskStore.reorderTasksInColumn(this.column.id, event.previousIndex, event.currentIndex);
    } else {
      // Moving task to different column
      const task = event.previousContainer.data[event.previousIndex];
      const newColumnId = this.column.id;

      this.taskStore.moveTaskToColumn(
        task.id,
        event.previousContainer.id,
        newColumnId,
        event.currentIndex,
      );
    }
  }
}
