import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskPriority } from '../../models/task.model';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, CardComponent, IconComponent],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
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
