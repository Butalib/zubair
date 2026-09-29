import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login-page';

const validLoginForm = {
  phoneNumber: '0775555003',
  password: 'secret123'
};

describe('LoginPage', () => {
  let fixture: ComponentFixture<LoginPage>;
  let loginPage: LoginPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [LoginPage]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPage);
    loginPage = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login page', () => {
    expect(loginPage).toBeTruthy();
  });

  it('should keep the form invalid until required credentials are supplied', () => {
    expect(loginPage.loginForm.invalid).toBe(true);

    loginPage.loginForm.setValue(validLoginForm);

    expect(loginPage.loginForm.valid).toBe(true);
  });

  it('should toggle password visibility state', () => {
    expect(loginPage.isPasswordVisible).toBe(false);

    loginPage.togglePasswordVisibility();

    expect(loginPage.isPasswordVisible).toBe(true);
  });
});
