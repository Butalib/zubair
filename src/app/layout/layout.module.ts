import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NavbarComponent }     from './navbar/navbar';
import { SidebarComponent }    from './sidebar/sidebar';
import { MainLayoutComponent } from './main-layout/main-layout';
import { HomeLayoutComponent } from './home-layout/home-layout';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    HomeLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    MainLayoutComponent,
    HomeLayoutComponent
  ]
})
export class LayoutModule {}
