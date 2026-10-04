import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ForgetPasswordRoutingModule } from './forget-password-routing-module';
import { ForgetPassword } from './forget-password/forget-password';

@NgModule({
  declarations: [ForgetPassword],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ForgetPasswordRoutingModule],
})
export class ForgetPasswordModule {}

