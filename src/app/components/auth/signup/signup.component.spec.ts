import { SignupComponent } from './signup.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<HotToastService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['register']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toast = jasmine.createSpyObj('HotToastService', [
      'success',
      'error',
      'warning'
    ]);

    component = new SignupComponent(authService, router, toast);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should signup successfully for user role', () => {
    authService.register.and.returnValue(of(true));

    component.name = 'test';
    component.email = 'test@example.com';
    component.password = 'password123';
    component.role = 'user';
    component.signup();

    expect(authService.register).toHaveBeenCalledWith(
      'test',
      'test@example.com',
      'password123',
      'user'
    );
    expect(toast.success).toHaveBeenCalledWith('Регистрация успешна! Теперь можете войти в аккаунт!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should signup successfully for admin role', () => {
    authService.register.and.returnValue(of(true));

    component.name = 'admin';
    component.email = 'admin@example.com';
    component.password = 'password123';
    component.role = 'admin';
    component.signup();

    expect(authService.register).toHaveBeenCalledWith(
      'admin',
      'admin@example.com',
      'password123',
      'admin'
    );
    expect(toast.success).toHaveBeenCalledWith('Регистрация успешна! Теперь можете войти в аккаунт!');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle signup failure', () => {
    authService.register.and.returnValue(of(false));

    component.signup();

    expect(authService.register).toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Ошибка при регистрации пользователя');
  });

  it('should handle invalid password', () => {
    component.password = 'short';
    component.validatePassword();

    expect(component.passwordValid).toBe(false);
    expect(toast.warning).toHaveBeenCalledWith('Пожалуйста введи правильно логин или пароль!');
  });
});
