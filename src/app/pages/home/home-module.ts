import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page/home-page';
import { ProductsSectionComponent } from './sections/products-section/products-section';
import { ClassificationsSectionComponent } from './sections/classifications-section/classifications-section';
import { BrandsSectionComponent } from './sections/brands-section/brands-section';

const routes: Routes = [
  { path: '', component: HomePageComponent }
];

@NgModule({
  declarations: [
    HomePageComponent,
    ProductsSectionComponent,
    ClassificationsSectionComponent,
    BrandsSectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule {}
