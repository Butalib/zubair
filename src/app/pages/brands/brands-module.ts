import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { BrandsPageComponent } from './brands-page/brands-page';
import { BrandProductsPageComponent } from './brand-products-page/brand-products-page';

const routes: Routes = [
  {
    path: '',
    component: BrandsPageComponent
  },
  {
    path: ':id',
    component: BrandProductsPageComponent
  }
];

@NgModule({
  declarations: [
    BrandsPageComponent,
    BrandProductsPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class BrandsModule {}
