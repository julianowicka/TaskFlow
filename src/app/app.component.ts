import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './core/components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NotificationComponent],
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.html',
})
export class AppComponent {
  title = 'TaskFlow';
}
