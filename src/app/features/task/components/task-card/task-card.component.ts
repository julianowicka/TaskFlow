import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent],
  template: `
    <ui-card [hoverable]="true" [padding]="'small'" class="task-card">
      <div class="task-card-content">
        <div class="task-header">
          <div *ngIf="task.labels && task.labels.length > 0" class="task-labels">
            <span
              *ngFor="let label of task.labels"
              class="task-label"
              [style.backgroundColor]="label.color"
            >
              {{ label.name }}
            </span>
          </div>

          <div class="task-priority" [ngClass]="'priority-' + task.priority">
            <ui-icon
              *ngIf="task.priority === 'high' || task.priority === 'urgent'"
              [name]="task.priority === 'urgent' ? 'alert-triangle' : 'alert-circle'"
              [size]="'16'"
            ></ui-icon>
          </div>
        </div>

        <h4 class="task-title">{{ task.title }}</h4>

        <div class="task-footer">
          <div class="task-meta">
            <div *ngIf="task.dueDate" class="task-due-date" [ngClass]="{ overdue: isOverdue() }">
              <ui-icon name="calendar" [size]="'14'"></ui-icon>
              <span>{{ formatDate(task.dueDate) }}</span>
            </div>

            <div *ngIf="task.checklist && task.checklist.length > 0" class="task-checklist">
              <ui-icon name="check-circle" [size]="'14'"></ui-icon>
              <span>{{ getCompletedChecklistCount() }}/{{ task.checklist.length }}</span>
            </div>
          </div>

          <div *ngIf="task.assigneeId" class="task-assignee">
            <div class="avatar">
              {{ getInitials(task.assigneeId) }}
            </div>
          </div>
        </div>
      </div>
    </ui-card>
  `,
  styles: [
    `
      .task-card {
        cursor: pointer;

        &:hover {
          box-shadow: var(--shadow-md);
        }
      }

      .task-card-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
      }

      .task-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .task-labels {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-1);
      }

      .task-label {
        font-size: var(--font-size-xs);
        padding: 0 var(--spacing-1);
        border-radius: var(--border-radius-sm);
        color: white;
        font-weight: var(--font-weight-medium);
      }

      .task-priority {
        display: flex;
        align-items: center;

        &.priority-urgent {
          color: var(--color-danger);
        }

        &.priority-high {
          color: var(--color-warning);
        }
      }

      .task-title {
        margin: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text);
        line-height: 1.4;
        word-break: break-word;
      }

      .task-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: var(--spacing-1);
      }

      .task-meta {
        display: flex;
        gap: var(--spacing-2);
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
      }

      .task-due-date,
      .task-checklist {
        display: flex;
        align-items: center;
        gap: var(--spacing-1);

        &.overdue {
          color: var(--color-danger);
        }
      }

      .task-assignee {
        .avatar {
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius-full);
          background-color: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }
      }

      // Drag & Drop styles
      .cdk-drag-preview {
        box-shadow: var(--shadow-lg);
        transform: rotate(2deg);
        border-radius: var(--border-radius-base);
      }

      .cdk-drag-placeholder {
        opacity: 0.3;
        border: 2px dashed var(--color-primary);
        border-radius: var(--border-radius-base);
        background: var(--color-surface-hover);
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class TaskCardComponent {
  @Input() task!: Task;

  formatDate(date: Date | string): string {
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if the date is today
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if the date is tomorrow
    if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    // Otherwise, return the formatted date
    return taskDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  isOverdue(): boolean {
    if (!this.task.dueDate) return false;

    const dueDate = new Date(this.task.dueDate);
    const today = new Date();

    // Remove time part for comparison
    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  getCompletedChecklistCount(): number {
    return this.task.checklist.filter((item) => item.isCompleted).length;
  }

  getInitials(userId: string): string {
    // In a real app, this would get the user's name from a user service
    // For now, just return a placeholder
    return 'U';
  }
}
