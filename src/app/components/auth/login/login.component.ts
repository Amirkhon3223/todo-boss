import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  name: string = '';
  password: string = '';

  constructor(
    private _authService: AuthService,
    private router: Router,
    private toast: HotToastService,
  ) {
  }

  login(): void {
    this._authService.login(this.name, this.password)
      .subscribe(success => {
        if (success) {
          const user = this._authService.getCurrentUser();
          if (user) {
            this.router.navigate(['home']);
            this.toast.success('Добро пожаловать!' + ' ' + user.name);
          }
        } else {
          this.toast.error('Неправильное имя пользователя или пароль.');
        }
      });
  }

}
