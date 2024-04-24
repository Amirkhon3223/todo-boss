import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { of } from 'rxjs';
import { User } from '../../../interfaces/user-interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<HotToastService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', [
      'login',
      'getCurrentUser'
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toast = jasmine.createSpyObj('HotToastService', [
      'success',
      'error'
    ]);

    component = new LoginComponent(authService, router, toast);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully', () => {
    const testUser: User = {
      id: 1,
      name: 'TestUser',
      role: 'user',
      email: 'test@example.com',
      password: 'password'
    };
    authService.login.and.returnValue(of(true));
    authService.getCurrentUser.and.returnValue(testUser);

    component.name = 'test';
    component.password = 'password';
    component.login();

    expect(authService.login).toHaveBeenCalledWith('test', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['home']);
    expect(toast.success).toHaveBeenCalledWith('Добро пожаловать! TestUser');
  });

  it('should handle login failure', () => {
    authService.login.and.returnValue(of(false));

    component.login();

    expect(authService.login).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Неправильное имя пользователя или пароль.');
  });

  it('should handle login error', () => {
    authService.login.and.returnValue(of(false));

    component.login();

    expect(authService.login).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Неправильное имя пользователя или пароль.');
  });
});
