import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // in milliseconds, 0 means no auto-dismiss
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([...currentNotifications, newNotification]);

    // Auto-dismiss if duration is specified
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.removeNotification(newNotification.id);
      }, notification.duration);
    }
  }

  success(title: string, message: string, duration: number = 3000): void {
    this.addNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  }

  error(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  }

  warning(title: string, message: string, duration: number = 4000): void {
    this.addNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  }

  info(title: string, message: string, duration: number = 3000): void {
    this.addNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  }

  removeNotification(id: string): void {
    const currentNotifications = this.notifications.value;
    this.notifications.next(currentNotifications.filter((n) => n.id !== id));
  }

  clearAll(): void {
    this.notifications.next([]);
  }

  getNotifications(): Notification[] {
    return this.notifications.value;
  }
}
