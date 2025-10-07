import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { BoardStore } from '../../services/board.store';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent, IconComponent],
  styleUrls: ['./board-list.component.scss'],
  template: `
    <div class="board-list-container">
      <header class="board-list-header">
        <h1>My Boards</h1>
        <ui-button (buttonClick)="openCreateBoardModal()">
          <ui-icon name="plus"></ui-icon>
          Create Board
        </ui-button>
      </header>

      <div class="board-list">
        <ng-container *ngIf="boardStore.isLoading(); else boardsContent">
          <div class="board-list-loading">
            <p>Loading boards...</p>
          </div>
        </ng-container>

        <ng-template #boardsContent>
          <ng-container *ngIf="boardStore.allBoards().length; else emptyState">
            <div class="board-grid">
              <ui-card
                *ngFor="let board of boardStore.allBoards()"
                [title]="board.title"
                [subtitle]="formatDate(board.updatedAt)"
                [hoverable]="true"
                class="board-card"
                (click)="navigateToBoard(board.id)"
              >
                <div class="board-card-content">
                  <p *ngIf="board.description">{{ board.description }}</p>
                  <div class="board-card-stats">
                    <span>{{ board.columnOrder.length }} columns</span>
                  </div>
                </div>
              </ui-card>
            </div>
          </ng-container>

          <ng-template #emptyState>
            <div class="board-list-empty">
              <p>You don't have any boards yet.</p>
              <ui-button (buttonClick)="openCreateBoardModal()">Create your first board</ui-button>
            </div>
          </ng-template>
        </ng-template>
      </div>
    </div>
  `,
  styles: [
    `
      .board-list-container {
        padding: var(--spacing-6);
        max-width: 1200px;
        margin: 0 auto;
      }

      .board-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-6);

        h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          margin: 0;
        }
      }

      .board-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-4);
      }

      .board-card {
        cursor: pointer;
      }

      .board-card-content {
        min-height: 100px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .board-card-stats {
        display: flex;
        justify-content: space-between;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-4);
      }

      .board-list-empty,
      .board-list-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-8);
        text-align: center;
        color: var(--color-text-secondary);
        background-color: var(--color-surface-hover);
        border-radius: var(--border-radius-lg);
        min-height: 200px;

        p {
          margin-bottom: var(--spacing-4);
          font-size: var(--font-size-lg);
        }
      }
    `,
  ],
})
export class BoardListComponent implements OnInit {
  constructor(
    public boardStore: BoardStore,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.boardStore.loadBoards();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  navigateToBoard(boardId: string): void {
    this.router.navigate(['/boards', boardId]);
  }

  openCreateBoardModal(): void {
    // This will be implemented with a modal service
    // For now, let's just create a sample board
    this.boardStore.createBoard(
      'New Board ' + (this.boardStore.allBoards().length + 1),
      'This is a sample board description',
    );
  }
}
