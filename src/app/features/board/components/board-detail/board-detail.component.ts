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
  templateUrl: './board-detail.component.html',
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
