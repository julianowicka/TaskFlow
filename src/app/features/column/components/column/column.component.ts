import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    CardComponent,
    ButtonComponent,
    IconComponent,
    TaskCardComponent,
  ],
  template: `
    <div class="column-container">
      <div class="column-header">
        <div class="column-title-wrapper">
          <div
            *ngIf="!isEditingTitle; else titleEditForm"
            class="column-title"
            (click)="startEditingTitle()"
          >
            <h3>{{ column.title }}</h3>
            <span class="task-count">{{ column.taskIds.length }}</span>
          </div>

          <ng-template #titleEditForm>
            <form class="column-title-form" (submit)="saveColumnTitle()">
              <input
                type="text"
                [(ngModel)]="editableTitle"
                name="columnTitle"
                class="column-title-input"
                (blur)="saveColumnTitle()"
                #titleInput
              />
            </form>
          </ng-template>
        </div>

        <div class="column-actions">
          <button class="column-action-btn" (click)="openColumnMenu()">
            <ui-icon name="menu"></ui-icon>
          </button>
        </div>
      </div>

      <div class="column-content">
        <div class="tasks-container">
          <app-task-card
            *ngFor="let task of tasks"
            [task]="task"
            (click)="openTaskDetail(task.id)"
          ></app-task-card>

          <div
            *ngIf="!isAddingTask; else addTaskForm"
            class="add-task-button"
            (click)="startAddingTask()"
          >
            <ui-button variant="text" size="sm">
              <ui-icon name="plus"></ui-icon>
              Add Task
            </ui-button>
          </div>

          <ng-template #addTaskForm>
            <div class="add-task-form">
              <ui-card [padding]="'small'" [bordered]="true">
                <textarea
                  [(ngModel)]="newTaskTitle"
                  placeholder="Enter task title..."
                  class="task-title-input"
                  rows="3"
                  #taskInput
                ></textarea>

                <div class="form-actions">
                  <ui-button variant="text" size="sm" (buttonClick)="cancelAddTask()">
                    Cancel
                  </ui-button>
                  <ui-button size="sm" [disabled]="!newTaskTitle.trim()" (buttonClick)="addTask()">
                    Add
                  </ui-button>
                </div>
              </ui-card>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .column-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--color-surface-hover);
        border-radius: var(--border-radius-lg);
        padding: var(--spacing-2);
      }

      .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-2) var(--spacing-2) var(--spacing-2) var(--spacing-3);
        margin-bottom: var(--spacing-2);
      }

      .column-title-wrapper {
        flex: 1;
        min-width: 0;
      }

      .column-title {
        display: flex;
        align-items: center;
        cursor: pointer;

        h3 {
          margin: 0;
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .task-count {
          margin-left: var(--spacing-2);
          background-color: var(--color-surface);
          color: var(--color-text-secondary);
          font-size: var(--font-size-xs);
          padding: 0 var(--spacing-2);
          border-radius: var(--border-radius-full);
          min-width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .column-title-form {
        width: 100%;
      }

      .column-title-input {
        width: 100%;
        padding: var(--spacing-1) var(--spacing-2);
        border: 1px solid var(--color-primary);
        border-radius: var(--border-radius-base);
        font-size: var(--font-size-md);
        font-weight: var(--font-weight-semibold);
        background-color: var(--color-surface);
        color: var(--color-text);

        &:focus {
          outline: none;
        }
      }

      .column-actions {
        display: flex;
      }

      .column-action-btn {
        background: none;
        border: none;
        cursor: pointer;
        color: var(--color-text-secondary);
        padding: var(--spacing-1);
        border-radius: var(--border-radius-base);
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          background-color: var(--color-surface);
          color: var(--color-text);
        }
      }

      .column-content {
        flex: 1;
        overflow-y: auto;
        padding: 0 var(--spacing-1);
      }

      .tasks-container {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        padding-bottom: var(--spacing-2);
      }

      .add-task-button {
        margin-top: var(--spacing-1);
      }

      .add-task-form {
        margin-top: var(--spacing-1);

        .task-title-input {
          width: 100%;
          padding: var(--spacing-2);
          border: none;
          resize: none;
          font-family: inherit;
          font-size: var(--font-size-sm);
          background-color: transparent;
          color: var(--color-text);

          &:focus {
            outline: none;
          }
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-2);
          margin-top: var(--spacing-2);
        }
      }
    `,
  ],
})
export class ColumnComponent {
  @Input() column!: Column;
  @Input() tasks: Task[] = [];

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
      document.querySelector('.column-title-input')?.focus();
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
      document.querySelector('.task-title-input')?.focus();
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
}
