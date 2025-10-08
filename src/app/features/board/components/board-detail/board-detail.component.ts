import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';

import { BoardStore } from '../../services/board.store';
import { ColumnStore } from '../../../column/services/column.store';
import { TaskStore } from '../../../task/services/task.store';

import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { ColumnComponent } from '../../../column/components/column/column.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CdkDropListGroup,
    ButtonComponent,
    IconComponent,
    CardComponent,
    InputComponent,
    ColumnComponent,
  ],
  styleUrls: ['./board-detail.component.scss'],
  template: `
    <div class="board-detail-container" *ngIf="boardStore.selectedBoard() as board">
      <header class="board-header">
        <div class="board-header-title">
          <h1>{{ board.title }}</h1>
          <p *ngIf="board.description" class="board-description">{{ board.description }}</p>
        </div>

        <div class="board-actions">
          <app-ui-button variant="secondary" size="sm" (buttonClick)="openBoardSettings()">
            <app-ui-icon name="settings"></app-ui-icon>
            Settings
          </app-ui-button>
        </div>
      </header>

      <div class="board-content">
        <div class="columns-container">
          <ng-container *ngIf="columnStore.isLoading(); else columnsContent">
            <div class="loading-state">
              <p>Loading columns...</p>
            </div>
          </ng-container>

          <ng-template #columnsContent>
            <div class="columns-wrapper" cdkDropListGroup>
              <div *ngFor="let column of columnStore.columnsByBoard()" class="column-wrapper">
                <app-column
                  [column]="column"
                  [tasks]="taskStore.tasksByColumn()[column.id] || []"
                  [dropListIds]="getDropListIds()"
                ></app-column>
              </div>

              <div class="add-column-wrapper">
                <app-ui-card [padding]="'medium'" [bordered]="true" class="add-column-card">
                  <div *ngIf="!showAddColumn; else addColumnForm" class="add-column-placeholder">
                    <app-ui-button variant="text" (buttonClick)="showAddColumn = true">
                      <app-ui-icon name="plus"></app-ui-icon>
                      Add Column
                    </app-ui-button>
                  </div>

                  <ng-template #addColumnForm>
                    <div class="add-column-form">
                      <app-ui-input
                        label="Column Title"
                        [(ngModel)]="newColumnTitle"
                        placeholder="Enter column title"
                        [required]="true"
                      ></app-ui-input>

                      <div class="form-actions">
                        <app-ui-button variant="text" (buttonClick)="cancelAddColumn()">
                          Cancel
                        </app-ui-button>
                        <app-ui-button
                          [disabled]="!newColumnTitle.trim()"
                          (buttonClick)="addColumn()"
                        >
                          Add Column
                        </app-ui-button>
                      </div>
                    </div>
                  </ng-template>
                </app-ui-card>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>

    <div class="board-not-found" *ngIf="!boardStore.selectedBoard() && !boardStore.isLoading()">
      <app-ui-card>
        <h2>Board not found</h2>
        <p>The board you're looking for doesn't exist or you don't have access to it.</p>
        <app-ui-button [routerLink]="['/boards']">Go to Boards</app-ui-button>
      </app-ui-card>
    </div>
  `,
  styles: [
    `
      .board-detail-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: var(--spacing-4);
      }

      .board-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: var(--spacing-4);
        padding: var(--spacing-2) var(--spacing-4);

        h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          margin: 0;
          color: var(--color-text);
        }

        .board-description {
          margin: var(--spacing-1) 0 0;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
        }
      }

      .board-content {
        flex: 1;
        overflow: hidden;
      }

      .columns-container {
        height: 100%;
        overflow-x: auto;
        padding-bottom: var(--spacing-4);
      }

      .columns-wrapper {
        display: flex;
        height: 100%;
        gap: var(--spacing-4);
        min-width: min-content;
      }

      .column-wrapper {
        width: 300px;
        height: 100%;
        flex-shrink: 0;
      }

      .add-column-wrapper {
        width: 300px;
        flex-shrink: 0;
      }

      .add-column-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .add-column-form {
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-2);
          margin-top: var(--spacing-4);
        }
      }

      .loading-state {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        color: var(--color-text-secondary);
      }

      .board-not-found {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        padding: var(--spacing-8);

        ui-card {
          max-width: 500px;
          text-align: center;
          padding: var(--spacing-6);

          h2 {
            margin-top: 0;
          }

          ui-button {
            margin-top: var(--spacing-4);
          }
        }
      }

      // Drag & Drop styles
      .columns-wrapper {
        &.cdk-drop-list-dragging {
          .column-wrapper {
            transition: all 200ms ease;
          }
        }
      }

      .column-wrapper {
        &.cdk-drop-list-receiving {
          background-color: var(--color-surface-hover);
          border: 2px dashed var(--color-primary);
          border-radius: var(--border-radius-lg);
          transition: all 200ms ease;
        }
      }
    `,
  ],
})
export class BoardDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  boardStore = inject(BoardStore);
  columnStore = inject(ColumnStore);
  taskStore = inject(TaskStore);

  showAddColumn = false;
  newColumnTitle = '';
  private routeSub?: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((params) => {
      const boardId = params.get('id');
      if (boardId) {
        this.boardStore.selectBoard(boardId);
        this.columnStore.loadColumns(boardId);
        this.taskStore.loadTasks(boardId);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  openBoardSettings(): void {
    // This will be implemented with a modal service
    console.log('Open board settings');
  }

  addColumn(): void {
    const board = this.boardStore.selectedBoard();
    if (board && this.newColumnTitle.trim()) {
      this.columnStore.createColumn(board.id, this.newColumnTitle.trim());
      this.cancelAddColumn();
    }
  }

  cancelAddColumn(): void {
    this.showAddColumn = false;
    this.newColumnTitle = '';
  }

  getDropListIds(): string[] {
    return this.columnStore.columnsByBoard().map((column) => column.id);
  }
}
