
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth-service/auth.service';

export function passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  if (confirmPassword && password !== confirmPassword) {
    control.get('confirmPassword')?.setErrors({ mismatch: true });
    return { mismatch: true };
  }

  if (control.get('confirmPassword')?.hasError('mismatch')) {
    control.get('confirmPassword')?.setErrors(null);
  }
  return null;
}

@Component({
  selector: 'app-register-page',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: false
})
export class Register implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);

  readonly isPasswordVisible = signal(false);
  readonly isConfirmPasswordVisible = signal(false);

  readonly isVerificationStep = signal(false);
  readonly displayPhone = signal('');

  readonly registerErrorMessage = signal<string | null>(null);
  readonly otpErrorMessage = signal<string | null>(null);

  readonly registerForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: passwordsMatchValidator
    }
  );

  readonly otpForm = this.fb.nonNullable.group({
    otp: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6)
    ]]
  });

  ngOnInit(): void {
    this.clearRegisterErrorOnInput();
    this.clearOtpErrorOnInput();
  }

  // -------------------------
  // Password visibility
  // -------------------------

  togglePasswordVisibility(): void {
    this.isPasswordVisible.update((visible) => !visible);
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible.update((visible) => !visible);
  }

  // -------------------------
  // Validation
  // -------------------------

  hasFieldError(
    controlName: 'name' | 'phone' | 'password' | 'confirmPassword',
    errorType?: string
  ): boolean {
    const control = this.registerForm.controls[controlName];

    if (!control.touched || !control.invalid) {
      return false;
    }

    return errorType
      ? control.hasError(errorType)
      : control.invalid;
  }

  hasOtpError(errorType?: string): boolean {
    const control = this.otpForm.controls.otp;

    if (!control.touched || !control.invalid) {
      return false;
    }

    return errorType
      ? control.hasError(errorType)
      : control.invalid;
  }

  // -------------------------
  // Registration
  // -------------------------

  submitRegister(): void {
    if (this.isLoading()) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.registerErrorMessage.set(null);

    const { name, phone, password } = this.registerForm.getRawValue();

    // Step 1: Signup
    this.authService
      .register({ phone, password, displayName: name })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          // Step 2: Automatically send OTP after signup
          this.authService
            .sendVerificationCode({ phone })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
              next: () => {
                this.isLoading.set(false);
                this.displayPhone.set(phone);
                this.isVerificationStep.set(true);
              },
              error: (err: unknown) => {
                this.isLoading.set(false);
                this.registerErrorMessage.set(this.mapRegisterError(err));
              },
            });
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.registerErrorMessage.set(this.mapRegisterError(err));
        },
      });
  }

  // -------------------------
  // OTP
  // -------------------------

  submitOtp(): void {
    if (this.isLoading()) return;

    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const phone = this.displayPhone();
    const { otp } = this.otpForm.getRawValue();

    this.isLoading.set(true);
    this.otpErrorMessage.set(null);

    // Step 3: Verify OTP
    this.authService
      .verifyOtp({ phone, code: otp })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.otpErrorMessage.set(this.mapOtpError(err));
        },
      });
  }

  resendCode(): void {
    if (this.isLoading()) return;

    const phone = this.displayPhone();
    this.isLoading.set(true);
    this.otpErrorMessage.set(null);

    this.authService
      .sendVerificationCode({ phone })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.otpForm.controls.otp.reset();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.otpErrorMessage.set(this.mapOtpError(err));
        },
      });
  }

  editData(): void {
    this.isVerificationStep.set(false);
    this.otpForm.reset();
    this.otpErrorMessage.set(null);
  }

  // -------------------------
  // Error handling
  // -------------------------

  private mapRegisterError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }

    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
    }

    const backendMessage = error.error?.message;
    const backendStatusCode =
      error.error?.error?.statusCode ?? error.status;

    if (
      backendStatusCode === 409 ||
      backendMessage
        ?.toLowerCase()
        .includes('phone already exists')
    ) {
      return 'رقم الجوال مسجل بالفعل. يرجى تسجيل الدخول.';
    }

    if (backendStatusCode === 400) {
      return backendMessage ||
        'بيانات غير صحيحة. يرجى مراجعة المدخلات.';
    }

    if (backendStatusCode >= 500) {
      return 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة بعد قليل.';
    }

    return backendMessage ||
      'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.';
  }

  private mapOtpError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت.';
    }
    if (error.status === 400 || error.status === 410) {
      return 'رمز التحقق غير صحيح أو منتهي الصلاحية.';
    }
    if (error.status === 429) {
      return 'تم تجاوز عدد المحاولات. يرجى الانتظار قليلاً.';
    }
    return error.error?.message || 'فشل التحقق. يرجى المحاولة مرة أخرى.';
  }

  // -------------------------
  // Error state cleanup
  // -------------------------

  private clearRegisterErrorOnInput(): void {
    this.registerForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.registerErrorMessage()) {
          this.registerErrorMessage.set(null);
        }
      });
  }

  private clearOtpErrorOnInput(): void {
    this.otpForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.otpErrorMessage()) {
          this.otpErrorMessage.set(null);
        }
      });
  }
}
