import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../interfaces/user-interface';
import { UserService } from './user.service';
import { environment } from '../../environment/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  private apiUrl = `${environment.apiUrl}/users`;
  private httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

  constructor(
    private http: HttpClient,
    private _userService: UserService
  ) {
    this.checkAuthStatus();
  }

  login(name: string, password: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?name=${name}`, this.httpOptions).pipe(
      map(users => {
        const user = users.find(u => u.password === password);
        if (user) {
          this.setLoggedInUser(user);
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

  getCurrentUser(): User {
    const userString = localStorage.getItem('user');
    return userString ? JSON.parse(userString) : null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  register(name: string, email: string, password: string, role: string): Observable<boolean> {
    const newUser = {name, password, email, role};
    return this.http.post<User>(this.apiUrl, newUser, this.httpOptions).pipe(
      map(() => true),
      catchError(error => {
        console.error('Registration error:', error);
        return of(false);
      })
    );
  }

  private checkAuthStatus(): void {
    const isLoggedIn = localStorage.getItem('loggedIn');
    this.loggedIn$.next(isLoggedIn === 'true');
  }

  private setLoggedInUser(user: User): void {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(user));
    this.loggedIn$.next(true);
    this._userService.setCurrentUser(user);
  }
}
