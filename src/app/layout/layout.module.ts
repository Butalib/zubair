import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent } from './navbar/navbar';
import { SidebarComponent } from './sidebar/sidebar';
import { MainLayoutComponent } from './main-layout/main-layout';
import { HomeLayoutComponent } from './home-layout/home-layout';
import { FooterComponent } from './footer/footer';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    HomeLayoutComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    HomeLayoutComponent,
    FooterComponent
  ]
})
export class LayoutModule { }
