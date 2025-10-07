import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div
        *ngFor="let notification of notifications"
        class="notification"
        [class]="'notification--' + notification.type"
        (click)="removeNotification(notification.id)"
      >
        <div class="notification__icon">
          <span *ngIf="notification.type === 'success'">✓</span>
          <span *ngIf="notification.type === 'error'">✕</span>
          <span *ngIf="notification.type === 'warning'">⚠</span>
          <span *ngIf="notification.type === 'info'">ℹ</span>
        </div>
        <div class="notification__content">
          <div class="notification__title">{{ notification.title }}</div>
          <div class="notification__message">{{ notification.message }}</div>
        </div>
        <button
          class="notification__close"
          (click)="removeNotification(notification.id)"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 400px;
      }

      .notification {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        transition: all 0.3s ease;
        animation: slideIn 0.3s ease-out;
        max-width: 100%;
      }

      .notification:hover {
        transform: translateX(-5px);
      }

      .notification--success {
        background-color: #d4edda;
        border-left: 4px solid #28a745;
        color: #155724;
      }

      .notification--error {
        background-color: #f8d7da;
        border-left: 4px solid #dc3545;
        color: #721c24;
      }

      .notification--warning {
        background-color: #fff3cd;
        border-left: 4px solid #ffc107;
        color: #856404;
      }

      .notification--info {
        background-color: #d1ecf1;
        border-left: 4px solid #17a2b8;
        color: #0c5460;
      }

      .notification__icon {
        font-size: 18px;
        font-weight: bold;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .notification__content {
        flex: 1;
        min-width: 0;
      }

      .notification__title {
        font-weight: 600;
        font-size: 14px;
        margin-bottom: 4px;
      }

      .notification__message {
        font-size: 13px;
        line-height: 1.4;
        opacity: 0.9;
      }

      .notification__close {
        background: none;
        border: none;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.7;
        transition: opacity 0.2s ease;
      }

      .notification__close:hover {
        opacity: 1;
      }

      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media (max-width: 480px) {
        .notification-container {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `,
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(
        (notifications) => (this.notifications = notifications),
      ),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  removeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }
}
