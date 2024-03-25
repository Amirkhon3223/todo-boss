import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor() { }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

}
