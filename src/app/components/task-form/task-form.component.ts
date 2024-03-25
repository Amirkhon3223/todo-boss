import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/tasks-interface';
import { MatDialogRef } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {
  task: Task = { title: '', project: '', type: '', deadline: '', planned: '' };
  constructor(
    private _taskService: TaskService,
    public dialogRef: MatDialogRef<TaskFormComponent>,
    private toast: HotToastService,
  ) {}

  addTask(): void {
    this.task.planned = this.task.planned.toString();

    this._taskService.addTask(this.task).subscribe({
      next: (newTask) => {
        console.log('New task added:', newTask);
        this.dialogRef.close();
        this.task = { title: '', project: '', type: '', deadline: '', planned: '' };
        // Уведомляем сервис о добавлении новой задачи
        this._taskService.notifyTaskAdded();
        this.toast.success("Новая задача добавлена");
      },
      error: (error) => {
        this.toast.error("Ошибка, задача не добавилась");
        console.error('There was an error!', error);
      }
    });
  }
}
