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
  templateUrl: './task-detail.component.html',
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
    const dateString = date ? date.toISOString() : undefined;
    this.editableTask.dueDate = dateString;
    this.taskStore.updateTask(this.task.id, { dueDate: dateString });
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
      createdAt: new Date().toISOString(),
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
