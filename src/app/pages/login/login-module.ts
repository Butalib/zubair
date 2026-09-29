import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginRoutingModule } from './login-routing-module';
import { LoginPage } from './login-page';

@NgModule({
  declarations: [LoginPage],
  imports: [ReactiveFormsModule, LoginRoutingModule],
  exports: [LoginPage]
})
export class LoginModule { }
