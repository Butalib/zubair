import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgetPassword } from './forget-password/forget-password';

const routes: Routes = [
  { path: '', component: ForgetPassword }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetPasswordRoutingModule {}

