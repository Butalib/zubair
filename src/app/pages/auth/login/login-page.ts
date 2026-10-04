import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

interface ILoginErrorFeedback {
  title: string;
  message: string;
}

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  standalone: false
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for reactive state
  readonly isLoading = signal(false);
  readonly isPasswordVisible = signal(false);
  readonly loginErrorMessage = signal<string | null>(null);

  readonly loginForm = this.fb.nonNullable.group({
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.loginForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.loginErrorMessage()) {
          this.loginErrorMessage.set(null);
        }
      });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update(v => !v);
  }

  hasFieldError(controlName: 'phoneNumber' | 'password', errorType?: string): boolean {
    const control = this.loginForm.controls[controlName];
    if (!control.touched || !control.invalid) {
      return false;
    }
    return errorType ? control.hasError(errorType) : control.invalid;
  }

  submitLogin(): void {
    if (this.isLoading()) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.loginErrorMessage.set(null);

    const { phoneNumber, password } = this.loginForm.getRawValue();
    // Remove all whitespace from the phone number
    const cleanPhone = phoneNumber.replace(/\s+/g, '');

    const credentials = {
      phone: cleanPhone,
      password
    };

    this.authService
      .login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.loginErrorMessage.set(null);
          this.router.navigate(['/']);
        },
        error: (error: unknown) => {
          this.isLoading.set(false);
          const errorFeedback = this.mapLoginError(error);
          this.loginErrorMessage.set(errorFeedback.message);
        }
      });
  }

  private mapLoginError(error: unknown): ILoginErrorFeedback {
    if (!(error instanceof HttpErrorResponse)) {
      return {
        title: 'خطأ غير متوقع',
        message: 'حدث خطأ غير متوقع أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى.'
      };
    }

    const backendMessage = error.error?.message;

    // 1. Network / Connectivity failure
    if (error.status === 0) {
      return {
        title: 'خطأ في الاتصال',
        message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
      };
    }

    if (error.status === 400) {
      return {
        title: 'بيانات غير صحيحة',
        message: backendMessage || 'رقم الجوال أو كلمة المرور غير صالحة.'
      };
    }

    // 2. Authentication / Invalid credentials
    if (error.status === 401 || error.status === 404) {
      return {
        title: 'بيانات الدخول غير صحيحة',
        message: backendMessage || 'رقم الجوال أو كلمة المرور غير صحيحة. يرجى التحقق من البيانات والمحاولة مرة أخرى.'
      };
    }

    // 3. Authorization / Account status restriction
    if (error.status === 403) {
      return {
        title: 'حساب مقيد',
        message: 'هذا الحساب غير مصرح له بالدخول حالياً. يرجى التواصل مع الدعم الفني.'
      };
    }

    // 4. Rate limiting / Too many attempts
    if (error.status === 429) {
      return {
        title: 'محاولات متكررة',
        message: 'تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً ثم المحاولة مجدداً.'
      };
    }

    // 5. Server / Infrastructure failure
    if (error.status >= 500) {
      return {
        title: 'خطأ في الخادم',
        message: 'الخدمة غير متاحة مؤقتاً بسبب مشكلة في الخادم. يرجى المحاولة بعد قليل.'
      };
    }

    return {
      title: 'تعذر تسجيل الدخول',
      message: backendMessage || 'تعذر تسجيل الدخول حالياً. يرجى المحاولة مرة أخرى.'
    };
  }
}
