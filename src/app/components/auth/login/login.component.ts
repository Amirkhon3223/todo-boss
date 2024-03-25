// LoginComponent
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
  email: string = '';
  password: string = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
  ) {}

  login(): void {
    this.authService.login(this.email, this.password)
      .subscribe(success => {
        if (success) {
          const user = this.authService.getCurrentUser();
          if (user) {
            this.router.navigate(['home']);
            this.toast.success("Добро пожаловать!" + ' ' + user.name)
          }
        } else {
          console.error('Login failed');
        }
      });
  }
}
