import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RegisterRoutingModule } from './register-routing-module';
import { Register } from './register/register';

@NgModule({
  declarations: [Register],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RegisterRoutingModule],
})
export class RegisterModule {}
