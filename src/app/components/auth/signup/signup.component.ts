import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  name: string = '';
  role!: string;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  passwordValid!: boolean;

  constructor(
    private _authService: AuthService,
    private router: Router,
    private toast: HotToastService
  ) {
  }

  signup(): void {
    if (this.name.trim() !== '' && this.email.trim() !== '' && this.passwordValid) {
      this._authService.register(this.name, this.email, this.password, this.role)
        .subscribe(success => {
          if (success) {
            this.toast.success('Регистрация успешна! Теперь можете войти в аккаунт!');
            this.router.navigate(['/login']);
          } else {
            this.toast.error('Ошибка при регистрации пользователя');
          }
        });
    } else {
      this.toast.warning('Пожалуйста введи правильно логин или пароль!');
    }
  }

  validatePassword(): void {
    this.passwordValid = this.password.length >= 8;
  }
}
