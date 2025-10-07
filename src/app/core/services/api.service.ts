import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../../features/board/models/board.model';
import { Column } from '../../features/column/models/column.model';
import { Task } from '../../features/task/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  // Board endpoints
  getBoards(ownerId: string): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.baseUrl}/boards?ownerId=${ownerId}`);
  }

  getBoardById(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.baseUrl}/boards/${id}`);
  }

  createBoard(board: Partial<Board>): Observable<Board> {
    return this.http.post<Board>(`${this.baseUrl}/boards`, board, this.httpOptions);
  }

  updateBoard(id: string, board: Partial<Board>): Observable<Board> {
    return this.http.put<Board>(`${this.baseUrl}/boards/${id}`, board, this.httpOptions);
  }

  updateColumnOrder(id: string, columnOrder: string[]): Observable<Board> {
    return this.http.put<Board>(
      `${this.baseUrl}/boards/${id}/column-order`,
      columnOrder,
      this.httpOptions,
    );
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/boards/${id}`);
  }

  archiveBoard(id: string): Observable<Board> {
    return this.http.put<Board>(`${this.baseUrl}/boards/${id}/archive`, {});
  }

  // Column endpoints
  getColumnsByBoard(boardId: string): Observable<Column[]> {
    return this.http.get<Column[]>(`${this.baseUrl}/columns/board/${boardId}`);
  }

  getColumnById(id: string): Observable<Column> {
    return this.http.get<Column>(`${this.baseUrl}/columns/${id}`);
  }

  createColumn(column: Partial<Column>): Observable<Column> {
    return this.http.post<Column>(`${this.baseUrl}/columns`, column, this.httpOptions);
  }

  updateColumn(id: string, column: Partial<Column>): Observable<Column> {
    return this.http.put<Column>(`${this.baseUrl}/columns/${id}`, column, this.httpOptions);
  }

  updateTaskOrder(id: string, taskIds: string[]): Observable<Column> {
    return this.http.put<Column>(
      `${this.baseUrl}/columns/${id}/task-order`,
      taskIds,
      this.httpOptions,
    );
  }

  updatePosition(id: string, position: number): Observable<Column> {
    return this.http.put<Column>(
      `${this.baseUrl}/columns/${id}/position`,
      position,
      this.httpOptions,
    );
  }

  deleteColumn(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/columns/${id}`);
  }

  // Task endpoints
  getTasksByBoard(boardId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/board/${boardId}`);
  }

  getTasksByColumn(columnId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/tasks/column/${columnId}`);
  }

  getTaskById(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task, this.httpOptions);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, task, this.httpOptions);
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  addChecklistItem(taskId: string, item: any): Observable<Task> {
    return this.http.post<Task>(
      `${this.baseUrl}/tasks/${taskId}/checklist`,
      item,
      this.httpOptions,
    );
  }

  updateChecklistItem(taskId: string, itemId: string, item: any): Observable<Task> {
    return this.http.put<Task>(
      `${this.baseUrl}/tasks/${taskId}/checklist/${itemId}`,
      item,
      this.httpOptions,
    );
  }

  deleteChecklistItem(taskId: string, itemId: string): Observable<Task> {
    return this.http.delete<Task>(`${this.baseUrl}/tasks/${taskId}/checklist/${itemId}`);
  }
}
