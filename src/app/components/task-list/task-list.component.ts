import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/tasks-interface';
import { TaskAddModalComponent } from '../task-add-modal/task-add-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FilterService } from '../../services/filter.service';
import { HeaderComponent } from '../header/header.component';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
  tasks: Task[] = [];
  selectedTasks: Task[] = [];
  allTasksSelected = false;
  private taskAddedSubscription!: Subscription;

  originalTasks: Task[] = [];
  searchQuery: string = '';
  selectedProject: string | null = null;
  selectedType: string | null = null;

  constructor(
    private _taskService: TaskService,
    private _authService: AuthService,
    public dialog: MatDialog,
    private _filterService: FilterService,
    private toast: HotToastService,
  ) {
  }

  enableEditing(task: Task) {
    task.isEditing = true;
    // Сохраняем оригинальные значения
    task.originalValues = { ...task };
  }

  cancelEditing(task: Task) {
    // Восстанавливаем оригинальные значения
    Object.assign(task, task.originalValues);
    task.isEditing = false;
  }

  saveTask(task: Task) {
    // Здесь логика для сохранения изменений задачи
    // Вызываем API для обновления задачи
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
    // Подписка на событие добавления задачи
    this.taskAddedSubscription = this._taskService.taskAdded().subscribe(() => {
      this.getTasks(); // Обновление списка задач
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
    // Отписываемся от подписки при уничтожении компонента
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
    if (this.isAdmin){
      this.selectedTasks.forEach(selectedTask => {
        if (selectedTask.id !== undefined) {
          this._taskService.deleteTask(selectedTask.id).subscribe(() => {
            this.tasks = this.tasks.filter(task => task.id !== selectedTask.id);
            this.toast.success('Успешно удалено!');
          });
        }
      });
      // Очищаем список выбранных задач
      this.selectedTasks = [];
      // Устанавливаем состояние главного чекбокса в false
      this.allTasksSelected = false;
      // Обновляем состояние всех чекбоксов в списке
      this.tasks.forEach(task => task.isSelected = false);
    }}

  toggleAllTasksSelection(): void {
    // Проверяем, выбраны ли все задачи
    const allSelected = this.tasks.every(task => task.isSelected);
    // Если все задачи уже выбраны, снимаем выбор со всех задач
    if (allSelected) {
      this.tasks.forEach(task => task.isSelected = false);
    } else {
      // А Тут если не все задачи выбраны, выбираем все задачи
      this.tasks.forEach(task => task.isSelected = true);
    }

    // Обновляем массив выбранных задач
    this.updateSelectedTasksArray();
  }

  updateSelectedTasksArray(): void {
    this.selectedTasks = this.tasks.filter(task => task.isSelected);
  }

  updateAllTasksSelected(): void {
    this.allTasksSelected = this.tasks.length > 0 && this.tasks.every(task => task.isSelected);
  }

  highlightedTaskId: number | null = null; // Инициализация переменной для выделенной задачи

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

    if (selectedProject) {
      filteredTasks = filteredTasks.filter(task => task.project === selectedProject);
    }

    if (selectedType) {
      filteredTasks = filteredTasks.filter(task => task.type === selectedType);
    }

    this.tasks = filteredTasks;
  }
}
