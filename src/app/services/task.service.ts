import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../interfaces/tasks-interface';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks`;
  private taskAddedSubject = new Subject<void>();

  constructor(private http: HttpClient) {
  }

  addTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  deleteTask(taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url);
  }

  updateTask(taskId: number, updatedData: Partial<Task>): Observable<Task> {
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.put<Task>(url, updatedData);
  }

  taskAdded(): Observable<void> {
    return this.taskAddedSubject.asObservable();
  }

  notifyTaskAdded(): void {
    this.taskAddedSubject.next();
  }
}
