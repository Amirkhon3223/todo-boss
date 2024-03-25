import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'; // добавляем FormsModule
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getCurrentUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      imports: [FormsModule] // добавляем FormsModule в imports
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('должен быть создан', () => {
    expect(component).toBeTruthy();
  });

  it('login должен вызывать метод login сервиса и перенаправлять на домашнюю страницу при успешном входе', () => {
    const testUser = { name: 'user', password: 'pass' };
    authServiceSpy.login.and.returnValue(of(true));
    authServiceSpy.getCurrentUser.and.returnValue(testUser);

    component.email = 'test@example.com';
    component.password = 'test';

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'test');
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

  it('login должен выводить ошибку в консоль при неудачном входе', () => {
    authServiceSpy.login.and.returnValue(of(false));

    component.email = 'test@example.com';
    component.password = 'test';

    spyOn(console, 'error');

    component.login();

    expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'test');
    expect(console.error).toHaveBeenCalledWith('Login failed');
  });
});
