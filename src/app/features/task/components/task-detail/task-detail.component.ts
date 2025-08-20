import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task, ChecklistItem, TaskPriority, TaskStatus } from '../../models/task.model';
import { TaskStore } from '../../services/task.store';
import { ModalComponent } from '../../../../shared/ui/modal/modal.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent, IconComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./task-detail.component.scss'],
  template: `
    <ui-modal
      *ngIf="isOpen"
      (modalClose)="closeModal()"
      [title]="task?.title || 'Task Details'"
      [size]="'large'"
    >
      <div class="task-detail-content" *ngIf="task">
        <div class="task-header">
          <div class="task-title-section">
            <input
              class="task-title-input"
              [(ngModel)]="editableTask.title"
              (blur)="updateField('title')"
              placeholder="Task title"
            />

            <div class="task-meta">
              <div class="task-id">ID: {{ task.id.slice(0, 8) }}</div>
              <div class="task-created">Created: {{ formatDate(task.createdAt) }}</div>
            </div>
          </div>
        </div>

        <div class="task-body">
          <div class="task-main">
            <div class="task-description-section">
              <h4>Description</h4>
              <textarea
                class="task-description-input"
                [(ngModel)]="editableTask.description"
                (blur)="updateField('description')"
                placeholder="Add a description..."
                rows="4"
              ></textarea>
            </div>

            <div
              class="task-checklist-section"
              *ngIf="editableTask.checklist?.length || isAddingChecklistItem"
            >
              <div class="section-header">
                <h4>Checklist</h4>
                <span class="checklist-progress">
                  {{ getCompletedChecklistCount() }}/{{ editableTask.checklist?.length || 0 }}
                </span>
              </div>

              <div class="checklist-items">
                <div
                  class="checklist-item"
                  *ngFor="let item of editableTask.checklist; let i = index"
                >
                  <div class="checklist-item-content">
                    <div class="checklist-checkbox">
                      <input
                        type="checkbox"
                        [checked]="item.isCompleted"
                        (change)="toggleChecklistItem(item)"
                      />
                    </div>
                    <div class="checklist-text" [class.completed]="item.isCompleted">
                      {{ item.text }}
                    </div>
                  </div>
                  <div class="checklist-actions">
                    <button class="icon-button" (click)="deleteChecklistItem(item)">
                      <ui-icon name="trash-2" [size]="'16'"></ui-icon>
                    </button>
                  </div>
                </div>
              </div>

              <div class="add-checklist-item" *ngIf="isAddingChecklistItem">
                <div class="checklist-item-content">
                  <input type="checkbox" disabled />
                  <input
                    type="text"
                    [(ngModel)]="newChecklistItemText"
                    placeholder="Add checklist item..."
                    class="checklist-item-text"
                    #checklistInput
                  />
                </div>
                <div class="add-checklist-actions">
                  <ui-button size="sm" (buttonClick)="addChecklistItem()">Add</ui-button>
                  <ui-button variant="text" size="sm" (buttonClick)="cancelAddChecklistItem()"
                    >Cancel</ui-button
                  >
                </div>
              </div>

              <ui-button
                *ngIf="!isAddingChecklistItem"
                variant="text"
                size="sm"
                (buttonClick)="startAddingChecklistItem()"
              >
                <ui-icon name="plus"></ui-icon>
                Add Item
              </ui-button>
            </div>

            <div class="task-comments-section">
              <h4>Comments</h4>
              <div class="comments-placeholder">
                <p>Comments will be implemented in a future update.</p>
              </div>
            </div>
          </div>

          <div class="task-sidebar">
            <div class="sidebar-section">
              <h5>Status</h5>
              <select [(ngModel)]="editableTask.status" (change)="updateField('status')">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div class="sidebar-section">
              <h5>Priority</h5>
              <select [(ngModel)]="editableTask.priority" (change)="updateField('priority')">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div class="sidebar-section">
              <h5>Due Date</h5>
              <input
                type="date"
                [ngModel]="editableTask.dueDate | date: 'yyyy-MM-dd'"
                (ngModelChange)="updateDueDate($event)"
              />
            </div>

            <div class="sidebar-section">
              <h5>Labels</h5>
              <div class="labels-placeholder">
                <p>Labels will be implemented in a future update.</p>
              </div>
            </div>

            <div class="sidebar-section">
              <h5>Attachments</h5>
              <div class="attachments-placeholder">
                <p>Attachments will be implemented in a future update.</p>
              </div>
            </div>

            <div class="sidebar-actions">
              <ui-button variant="danger" size="sm" (buttonClick)="deleteTask()">
                <ui-icon name="trash"></ui-icon>
                Delete Task
              </ui-button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer" slot="footer">
        <ui-button variant="text" (buttonClick)="closeModal()">Close</ui-button>
      </div>
    </ui-modal>
  `,
  styles: [
    `
      .task-detail-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .task-header {
        padding-bottom: var(--spacing-4);
        border-bottom: 1px solid var(--color-border);
      }

      .task-title-input {
        width: 100%;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        padding: var(--spacing-2);
        border: 1px solid transparent;
        border-radius: var(--border-radius-base);
        background-color: transparent;

        &:focus {
          outline: none;
          border-color: var(--color-border);
          background-color: var(--color-surface);
        }

        &:hover:not(:focus) {
          background-color: var(--color-surface-hover);
        }
      }

      .task-meta {
        display: flex;
        gap: var(--spacing-4);
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        margin-top: var(--spacing-1);
        padding-left: var(--spacing-2);
      }

      .task-body {
        display: flex;
        gap: var(--spacing-6);

        .task-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-6);
        }

        .task-sidebar {
          width: 240px;
          flex-shrink: 0;
        }
      }

      h4,
      h5 {
        margin: 0 0 var(--spacing-2) 0;
        font-weight: var(--font-weight-semibold);
      }

      .task-description-input {
        width: 100%;
        padding: var(--spacing-2);
        border: 1px solid var(--color-border);
        border-radius: var(--border-radius-base);
        font-family: inherit;
        font-size: var(--font-size-sm);
        resize: vertical;

        &:focus {
          outline: none;
          border-color: var(--color-primary);
        }
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .checklist-progress {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }
      }

      .checklist-items {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-2);
        margin-bottom: var(--spacing-2);
      }

      .checklist-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-2);

        .checklist-item-content {
          flex: 1;
          display: flex;
          align-items: center;
          gap: var(--spacing-2);
        }

        .checklist-checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius-base);
          background-color: var(--color-surface);
          cursor: pointer;

          &:hover {
            background-color: var(--color-surface-hover);
          }
        }

        .checklist-text {
          flex: 1;
          padding: var(--spacing-1) var(--spacing-2);
          border: none;
          border-radius: var(--border-radius-base);
          font-size: var(--font-size-sm);
          background-color: transparent;

          &.completed {
            text-decoration: line-through;
            color: var(--color-text-secondary);
          }

          &:focus {
            outline: none;
            background-color: var(--color-surface);
          }

          &:hover:not(:focus) {
            background-color: var(--color-surface-hover);
          }
        }

        .checklist-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: var(--border-radius-base);
          background-color: transparent;
          cursor: pointer;

          &:hover {
            background-color: var(--color-surface-hover);
          }
        }

        .icon-button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-secondary);
          padding: var(--spacing-1);
          border-radius: var(--border-radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
          visibility: hidden;

          &:hover {
            background-color: var(--color-surface);
            color: var(--color-danger);
          }
        }

        &:hover .icon-button {
          visibility: visible;
        }
      }

      .add-checklist-item {
        margin-bottom: var(--spacing-2);

        .add-checklist-actions {
          display: flex;
          gap: var(--spacing-2);
          margin-top: var(--spacing-2);
          margin-left: 24px;
        }
      }

      .sidebar-section {
        margin-bottom: var(--spacing-4);

        select,
        input[type='date'] {
          width: 100%;
          padding: var(--spacing-2);
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-base);
          background-color: var(--color-surface);
          font-size: var(--font-size-sm);

          &:focus {
            outline: none;
            border-color: var(--color-primary);
          }
        }
      }

      .labels-placeholder,
      .attachments-placeholder,
      .comments-placeholder {
        padding: var(--spacing-2);
        background-color: var(--color-surface-hover);
        border-radius: var(--border-radius-base);
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        text-align: center;
      }

      .sidebar-actions {
        margin-top: var(--spacing-6);
      }
    `,
  ],
})
export class TaskDetailComponent implements OnInit {
  @Input() isOpen = false;
  @Input() taskId?: string;
  @Output() closed = new EventEmitter<void>();

  task?: Task;
  editableTask: Partial<Task> = {};

  isAddingChecklistItem = false;
  newChecklistItemText = '';

  constructor(private taskStore: TaskStore) {}

  ngOnInit(): void {
    if (this.taskId) {
      this.loadTask(this.taskId);
    }
  }

  loadTask(taskId: string): void {
    // Find the task in the store
    const task = this.taskStore.allTasks().find((t) => t.id === taskId);
    if (task) {
      this.task = task;
      this.editableTask = { ...task };
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  updateField(field: keyof Task): void {
    if (!this.task) return;

    // Handle potential undefined values safely
    const updateData = { [field]: this.editableTask[field] || null };
    this.taskStore.updateTask(this.task.id, updateData);
  }

  updateDueDate(date: Date | null): void {
    if (!this.task) return;
    this.editableTask.dueDate = date || undefined;
    this.taskStore.updateTask(this.task.id, { dueDate: date || undefined });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getCompletedChecklistCount(): number {
    return this.editableTask.checklist?.filter((item) => item.isCompleted).length || 0;
  }

  startAddingChecklistItem(): void {
    this.isAddingChecklistItem = true;
    this.newChecklistItemText = '';
    setTimeout(() => {
      document.querySelector<HTMLInputElement>('#checklistInput')?.focus();
    }, 0);
  }

  addChecklistItem(): void {
    if (!this.newChecklistItemText.trim() || !this.task) return;

    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: this.newChecklistItemText.trim(),
      isCompleted: false,
      createdAt: new Date(),
    };

    // Initialize checklist array if it doesn't exist
    if (!this.editableTask.checklist) {
      this.editableTask.checklist = [];
    }

    this.editableTask.checklist.push(newItem);
    this.taskStore.updateTask(this.task.id, { checklist: this.editableTask.checklist });

    this.cancelAddChecklistItem();
  }

  cancelAddChecklistItem(): void {
    this.isAddingChecklistItem = false;
    this.newChecklistItemText = '';
  }

  toggleChecklistItem(item: ChecklistItem): void {
    if (!this.task) return;

    item.isCompleted = !item.isCompleted;
    // Update the entire task with the modified checklist
    this.taskStore.updateTask(this.task.id, { checklist: this.editableTask.checklist });
  }

  updateChecklistItem(item: ChecklistItem): void {
    if (!this.task) return;

    // Update the entire task with the modified checklist
    this.taskStore.updateTask(this.task.id, { checklist: this.editableTask.checklist });
  }

  deleteChecklistItem(item: ChecklistItem): void {
    if (!this.task || !this.editableTask.checklist) return;

    this.editableTask.checklist = this.editableTask.checklist.filter((i) => i.id !== item.id);
    // Update the entire task with the modified checklist
    this.taskStore.updateTask(this.task.id, { checklist: this.editableTask.checklist });
  }

  deleteTask(): void {
    if (!this.task) return;

    if (confirm('Are you sure you want to delete this task?')) {
      this.taskStore.deleteTask(this.task.id);
      this.closeModal();
    }
  }
}
