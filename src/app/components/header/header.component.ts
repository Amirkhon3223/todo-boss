import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user-interface';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/tasks-interface';
import { FilterService } from '../../services/filter.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  tasks: Task[] = [];
  searchQuery: string = '';
  selectedProject: string | null = null;
  selectedType: string | null = null;
  projects: string[] = [];
  types: string[] = [];
  originalTasks: Task[] = [];

  constructor(
    private _authService: AuthService,
    private _taskService: TaskService,
    private _filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this._taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.originalTasks = tasks; // Сохраняем исходный список задач
      this.projects = this.getUniqueProjects();
      this.types = this.getUniqueTypes();
    });
  }

  /**
   * Возвращает массив уникальных проектов.
   * Используется метод map для получения значений полей "project и Type" из каждой задачи в массиве this.tasks.
   * Затем создается новый Set, который автоматически удаляет дубликаты значений.
   * Из Set создается массив с помощью Array.from, чтобы преобразовать его обратно в массив строк.
   *
   * @getUniqueProjects Массив уникальных проектов.
   * @getUniqueTypes Массив уникальных типов.
   */
  getUniqueProjects(): string[] {
    return Array.from(new Set(this.tasks.map(task => task.project)));
  }

  getUniqueTypes(): string[] {
    return Array.from(new Set(this.tasks.map(task => task.type)));
  }


  search(): void {
    this._filterService.setSearchQuery(this.searchQuery);
  }

  /** Применяет выбранные проект и тип для фильтрации задач. */
  filter(): void {
    this._filterService.setSelectedProject(this.selectedProject);
    this._filterService.setSelectedType(this.selectedType);
  }

  /** Сбрасывает все фильтры и поисковый запрос. */
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedProject = null;
    this.selectedType = null;
    this._filterService.setSearchQuery('');
    this._filterService.setSelectedProject(null);
    this._filterService.setSelectedType(null);
  }

  // Метод для выполнения выхода из системы
  onLogOut(): void {
    this._authService.logout();
    window.location.reload();
  }
}
