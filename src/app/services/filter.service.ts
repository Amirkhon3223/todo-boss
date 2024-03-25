import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private searchQuerySubject = new BehaviorSubject<string>('');
  private selectedProjectSubject = new BehaviorSubject<string | null>(null);
  private selectedTypeSubject = new BehaviorSubject<string | null>(null);

  constructor() {}

  /**
   * Устанавливает поисковый запрос для фильтрации задач.
   * @param {string} query - Поисковый запрос.
   */
  setSearchQuery(query: string): void {
    this.searchQuerySubject.next(query);
  }

  /**
   * Возвращает Observable с текущим поисковым запросом.
   * @returns {Observable<string>} Текущий поисковый запрос.
   */
  getSearchQuery(): Observable<string> {
    return this.searchQuerySubject.asObservable();
  }

  /**
   * Устанавливает выбранный проект для фильтрации задач.
   * @param {string | null} project - Идентификатор или название проекта.
   */
  setSelectedProject(project: string | null): void {
    this.selectedProjectSubject.next(project);
  }

  /**
   * Возвращает Observable с текущим выбранным проектом.
   * @returns {Observable<string | null>} Текущий выбранный проект.
   */
  getSelectedProject(): Observable<string | null> {
    return this.selectedProjectSubject.asObservable();
  }

  /**
   * Устанавливает выбранный тип задачи для фильтрации.
   * @param {string | null} type - Тип задачи.
   */
  setSelectedType(type: string | null): void {
    this.selectedTypeSubject.next(type);
  }

  /**
   * Возвращает Observable с текущим выбранным типом задачи.
   * @returns {Observable<string | null>} Текущий выбранный тип задачи.
   */
  getSelectedType(): Observable<string | null> {
    return this.selectedTypeSubject.asObservable();
  }
}
