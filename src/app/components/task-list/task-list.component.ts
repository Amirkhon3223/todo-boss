import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/tasks-interface';
import { TaskAddModalComponent } from '../task-add-modal/task-add-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';
import { HotToastService } from '@ngneat/hot-toast';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [DatePipe]
})
export class TaskListComponent implements OnInit, OnDestroy {
  isAdmin: boolean | null = false;
  tasks: Task[] = [];
  selectedTasks: Task[] = [];
  allTasksSelected = false;
  originalTasks: Task[] = [];
  searchQuery: string = '';
  selectedProject: string | null = null;
  selectedType: string | null = null;
  highlightedTaskId: number | null = null;
  private taskAddedSubscription!: Subscription;

  constructor(
    private _taskService: TaskService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private _filterService: FilterService,
    private toast: HotToastService,
    private datePipe: DatePipe
  ) {
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }

  enableEditing(task: Task) {
    task.isEditing = true;
    task.originalValues = {...task};
  }

  cancelEditing(task: Task) {
    Object.assign(task, task.originalValues);
    task.isEditing = false;
  }

  saveTask(task: Task) {
    if (task.id) {
      this._taskService.updateTask(task.id, {
        title: task.title,
        project: task.project,
        type: task.type,
        deadline: task.deadline,
        planned: task.planned
      }).subscribe({
        next: (updatedTask) => {
          Object.assign(task, updatedTask);
          task.isEditing = false;
          this.toast.success('Задача обновлена успешно');
        },
        error: () => this.toast.error('Ошибка при сохранении задачи')
      });
    }
  }

  ngOnInit() {
    this.isAdmin = this._authService.isAdmin();
    this.getTasks();
    this.taskAddedSubscription = this._taskService.taskAdded().subscribe(() => {
      this.getTasks();
    });

    this._filterService.getSearchQuery().subscribe(query => {
      this.applyFilters(query, this.selectedProject, this.selectedType);
    });

    this._filterService.getSelectedProject().subscribe(project => {
      this.selectedProject = project;
      this.applyFilters(this.searchQuery, project, this.selectedType);
    });

    this._filterService.getSelectedType().subscribe(type => {
      this.selectedType = type;
      this.applyFilters(this.searchQuery, this.selectedProject, type);
    });
  }

  ngOnDestroy(): void {
    this.taskAddedSubscription.unsubscribe();
  }

  getTasks(): void {
    this._taskService.getTasks().subscribe(tasks => {
      this.originalTasks = tasks;
      this.tasks = [...this.originalTasks];
    });
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskAddModalComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getTasks();
      }
    });
  }

  updateSelectedTasks(task: Task): void {
    if (task.isSelected) {
      this.selectedTasks.push(task);
    } else {
      const index = this.selectedTasks.findIndex(selectedTask => selectedTask.id === task.id);
      if (index !== -1) {
        this.selectedTasks.splice(index, 1);
      }
    }
    this.updateAllTasksSelected();
  }

  deleteSelectedTasks(): void {
    if (this.isAdmin) {
      this.selectedTasks.forEach(selectedTask => {
        if (selectedTask.id !== undefined) {
          this._taskService.deleteTask(selectedTask.id).subscribe(() => {
            this.tasks = this.tasks.filter(task => task.id !== selectedTask.id);
            this.toast.success('Успешно удалено!');
          });
        }
      });
      this.selectedTasks = [];
      this.allTasksSelected = false;
      this.tasks.forEach(task => task.isSelected = false);
    }
  }

  toggleAllTasksSelection(): void {
    const allSelected = this.tasks.every(task => task.isSelected);
    if (allSelected) {
      this.tasks.forEach(task => task.isSelected = false);
    } else {
      this.tasks.forEach(task => task.isSelected = true);
    }
    this.updateSelectedTasksArray();
  }

  updateSelectedTasksArray(): void {
    this.selectedTasks = this.tasks.filter(task => task.isSelected);
  }

  updateAllTasksSelected(): void {
    this.allTasksSelected = this.tasks.length > 0 && this.tasks.every(task => task.isSelected);
  }

  highlightTask(taskId: number): void {
    this.highlightedTaskId = this.highlightedTaskId === taskId ? null : taskId;
  }

  isTaskHighlighted(taskId: number): boolean {
    return this.highlightedTaskId === taskId;
  }

  applyFilters(searchQuery: string, selectedProject: string | null, selectedType: string | null): void {
    let filteredTasks = this.originalTasks;

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task => task.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (selectedProject && selectedProject !== 'Все проекты') {
      filteredTasks = filteredTasks.filter(task => task.project === selectedProject);
    }

    if (selectedType && selectedType !== 'Все типы') {
      filteredTasks = filteredTasks.filter(task => task.type === selectedType);
    }

    this.tasks = filteredTasks;
  }
}
