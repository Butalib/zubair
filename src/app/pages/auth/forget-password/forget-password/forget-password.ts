import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth-service/auth.service';

/** Validates that two password controls match */
function passwordsMatchValidator(
  newPassKey: string,
  confirmPassKey: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const newPass = group.get(newPassKey)?.value;
    const confirmPass = group.get(confirmPassKey)?.value;
    if (confirmPass && newPass !== confirmPass) {
      group.get(confirmPassKey)?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    if (group.get(confirmPassKey)?.hasError('mismatch')) {
      group.get(confirmPassKey)?.setErrors(null);
    }
    return null;
  };
}

// Step 1: phone number input — Step 2: OTP verify — Step 3: new password
type ForgotStep = 'phone' | 'verify' | 'reset';

@Component({
  selector: 'app-forget-password',
  standalone: false,
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // ── UI State (Signals — reactive without ChangeDetectorRef) ──
  readonly currentStep = signal<ForgotStep>('phone');
  readonly isLoading = signal(false);
  readonly isNewPasswordVisible = signal(false);
  readonly isConfirmPasswordVisible = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successBanner = signal<string | null>(null);
  readonly resendCooldown = signal(0);

  private resendInterval: ReturnType<typeof setInterval> | null = null;

  // ── Step 1 form ──
  readonly phoneForm = this.fb.nonNullable.group({
    phone: [
      '',
      [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)],
    ],
  });

  // ── Step 2 form — OTP verify ──
  readonly verifyForm = this.fb.nonNullable.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
  });

  // ── Step 3 form — New Password ──
  readonly resetForm = this.fb.nonNullable.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') }
  );

  ngOnInit(): void {
    this.phoneForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => { if (this.errorMessage()) this.errorMessage.set(null); });

    this.verifyForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => { if (this.errorMessage()) this.errorMessage.set(null); });

    this.resetForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => { if (this.errorMessage()) this.errorMessage.set(null); });
  }

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  // ── Helpers ──
  hasPhoneError(errorType?: string): boolean {
    const ctrl = this.phoneForm.controls.phone;
    if (!ctrl.touched || !ctrl.invalid) return false;
    return errorType ? ctrl.hasError(errorType) : ctrl.invalid;
  }

  hasVerifyError(errorType?: string): boolean {
    const ctrl = this.verifyForm.controls.otp;
    if (!ctrl.touched || !ctrl.invalid) return false;
    return errorType ? ctrl.hasError(errorType) : ctrl.invalid;
  }

  hasResetError(
    controlName: 'newPassword' | 'confirmPassword',
    errorType?: string
  ): boolean {
    const ctrl = this.resetForm.controls[controlName];
    if (!ctrl.touched || !ctrl.invalid) return false;
    return errorType ? ctrl.hasError(errorType) : ctrl.invalid;
  }

  toggleNewPasswordVisibility(): void {
    this.isNewPasswordVisible.update(v => !v);
  }

  toggleConfirmPasswordVisibility(): void {
    this.isConfirmPasswordVisible.update(v => !v);
  }

  // ── Step 1: Send OTP ──
  submitPhone(): void {
    if (this.isLoading()) return;
    if (this.phoneForm.invalid) {
      this.phoneForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { phone } = this.phoneForm.getRawValue();

    this.authService
      .sendOtp({ phone })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.currentStep.set('verify');
          this.successBanner.set(null);
          this.startResendCooldown();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.mapError(err));
        },
      });
  }

  // ── Step 2: Resend OTP ──
  resendOtp(): void {
    if (this.resendCooldown() > 0 || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successBanner.set(null);

    const { phone } = this.phoneForm.getRawValue();

    this.authService
      .sendOtp({ phone })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.successBanner.set(`تم إرسال رمز جديد إلى ${phone}`);
          this.startResendCooldown();
          this.verifyForm.controls.otp.reset();
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.mapError(err));
        },
      });
  }

  // ── Step 2: Verify OTP ──
  submitVerify(): void {
    if (this.isLoading()) return;
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { phone } = this.phoneForm.getRawValue();
    const { otp } = this.verifyForm.getRawValue();

    this.authService
      .verifyOtp({ phone, code: otp })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.currentStep.set('reset');
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.mapError(err));
        },
      });
  }

  // ── Step 3: Reset Password ──
  submitReset(): void {
    if (this.isLoading()) return;
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const { phone } = this.phoneForm.getRawValue();
    const { otp } = this.verifyForm.getRawValue();
    const { newPassword } = this.resetForm.getRawValue();

    this.authService
      .resetPassword({ phone, code: otp, newPassword })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/login']);
        },
        error: (err: unknown) => {
          this.isLoading.set(false);
          this.errorMessage.set(this.mapError(err));
        },
      });
  }

  // ── Go back to phone step ──
  changePhone(): void {
    this.currentStep.set('phone');
    this.errorMessage.set(null);
    this.successBanner.set(null);
    this.verifyForm.reset();
    this.resetForm.reset();
    this.clearResendTimer();
    this.resendCooldown.set(0);
  }

  // ── Resend cooldown timer ──
  private startResendCooldown(): void {
    this.resendCooldown.set(60);
    this.clearResendTimer();
    this.resendInterval = setInterval(() => {
      this.resendCooldown.update(v => v - 1);
      if (this.resendCooldown() <= 0) {
        this.clearResendTimer();
      }
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendInterval !== null) {
      clearInterval(this.resendInterval);
      this.resendInterval = null;
    }
  }

  // ── Error mapping ──
  private mapError(error: unknown): string {
    if (!(error instanceof HttpErrorResponse)) {
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
    }
    if (error.status === 0) {
      return 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.';
    }
    if (error.status === 400) {
      return 'رقم الجوال غير صحيح أو الرمز المدخل غير صالح.';
    }
    if (error.status === 404) {
      return 'رقم الجوال غير مسجل في النظام.';
    }
    if (error.status === 410) {
      return 'انتهت صلاحية رمز التحقق. يرجى طلب رمز جديد.';
    }
    if (error.status === 429) {
      return 'تم تجاوز عدد المحاولات المسموح بها. يرجى الانتظار قليلاً.';
    }
    if (error.status >= 500) {
      return 'الخدمة غير متاحة مؤقتاً. يرجى المحاولة بعد قليل.';
    }
    return 'تعذرت العملية حالياً. يرجى المحاولة مرة أخرى.';
  }
}
