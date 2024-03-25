import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { Task } from '../interfaces/tasks-interface';

describe('TaskService', () => {
  let service: TaskService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // тут после каждого теста нужно чкнуть, что нет открытых запросов
    httpController.verify();
  });

  it('должен быть создан', () => {
    expect(service).toBeTruthy();
  });

  it('getTasks() должен возвращать задачи', () => {
    const mockTasks: Task[] = [
      { id: 1, title: 'Тестовая задача 1', project: 'Проект 1', type: 'Bug', deadline: '2021-01-01', planned: '2021-01-01T12:00' },
      { id: 2, title: 'Тестовая задача 2', project: 'Проект 2', type: 'Feature', deadline: '2021-02-01', planned: '2021-02-01T12:00' }
    ];

    service.getTasks().subscribe(tasks => {
      expect(tasks.length).toBe(2);
      expect(tasks).toEqual(mockTasks);
    });

    const req = httpController.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toEqual('GET');
    req.flush(mockTasks);
  });

  it('addTask() должен отправить POST-запрос и вернуть задачу', () => {
    const newTask: Task = { title: 'Новая задача', project: 'Проект 3', type: 'Bug', deadline: '2021-03-01', planned: '2021-03-01T12:00' };

    service.addTask(newTask).subscribe(task => {
      expect(task).toEqual(newTask);
    });

    const req = httpController.expectOne(`${service['apiUrl']}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);
    req.flush(newTask);
  });

  it('deleteTask() должен отправить DELETE-запрос и вернуть пустой ответ', () => {
    const taskId = 1;

    service.deleteTask(taskId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpController.expectOne(`${service['apiUrl']}/${taskId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
