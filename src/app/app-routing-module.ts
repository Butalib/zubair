import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login-module').then(m => m.LoginModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./pages/auth/forget-password/forget-password-module').then(m => m.ForgetPasswordModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/auth/register/register-module').then(m => m.RegisterModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
