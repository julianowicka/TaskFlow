import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  styleUrls: ['./footer.component.scss'],
  template: `
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-logo">
            <span class="logo-text">TaskFlow</span>
            <span class="copyright">© 2025 TaskFlow</span>
          </div>

          <nav class="footer-nav">
            <ul class="nav-list">
              <li class="nav-item">
                <a routerLink="/about">About</a>
              </li>
              <li class="nav-item">
                <a routerLink="/privacy">Privacy</a>
              </li>
              <li class="nav-item">
                <a routerLink="/terms">Terms</a>
              </li>
              <li class="nav-item">
                <a routerLink="/help">Help</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
