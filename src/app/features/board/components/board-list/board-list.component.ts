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
  templateUrl: './board-list.component.html',
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
