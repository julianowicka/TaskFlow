// user.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule, SlicePipe, UpperCasePipe } from '@angular/common';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [CommonModule, SlicePipe, UpperCasePipe],
})
export class UserComponent {
  @Input() user?: { name?: string; age?: number };
}
