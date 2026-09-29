import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from 'src/app/core/services/data/data.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  standalone: false
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dataService = inject(DataService);
  ngOnInit(): void {

    this.testApiCall(); // Call the test API method on component initialization
  }

  testApiCall(): void {
    // const url = "auth/login";
    const url = "token/logout";

    const body = {
      // "phone": "+9647712617606",
      // "password": "123456"
      "token": { "$gt": "" }


    };
    this.dataService.postData(url, body).subscribe({
      next: (response) => {
        console.log('API response:', response);
      },
      error: (error) => {
        console.error('API error:', error);
      }
    });
  }










  readonly loginForm = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required, Validators.pattern(/^07\d{9}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Authentication will be connected when the backend contract is introduced.
  }
}
