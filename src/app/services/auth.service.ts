// AuthService
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { switchMap, catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/user-interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private apiUrl = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private _userService: UserService
  ) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('loggedIn');
    this.loggedIn$.next(isLoggedIn === 'true');
  }

  login(name: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`).pipe(
      map(users => {
        const user = users.find(u => u.password === password);
        if (user) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(user));
          this.loggedIn$.next(true);
          this._userService.setCurrentUser(user);
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    this.loggedIn$.next(false);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  getCurrentUser(): any {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  setCurrentRole(role: string): void {
    const user = this.getCurrentUser();
    if (user) {
      user.role = role;
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  register(name: string, email: string, password: string, role: string): Observable<boolean> {
    return this.getUserByName(name, email).pipe(
      switchMap(existingUser => {
        if (existingUser && existingUser.length > 0) {
          return of(false); // Пользователь уже существует
        } else {
          const newUser = { name, password, email, role };
          return this.http.post(this.apiUrl, newUser).pipe(
            map(() => true), // Регистрация успешна
            catchError(error => {
              console.error('Registration error:', error);
              return of(false); // Ошибка регистрации
            })
          );
        }
      })
    );
  }

  private getUserByName(name: string, email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?name=${name}&email=${email}`);
  }
}
