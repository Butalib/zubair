import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CategoriesPageComponent } from './categories-page/categories-page';

import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: CategoriesPageComponent }
];

@NgModule({
  declarations: [
    CategoriesPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoriesModule {}

