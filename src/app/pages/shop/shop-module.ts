import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ClassificationPageComponent } from './classification-page/classification-page';
import { SubclassPageComponent } from './subclass-page/subclass-page';

// ─── Child Routes ───────────────────────────────────────────────────────────
// هنا بنعرف الـ routes الـ children تحت /shop
// الـ :id في كل route هو الـ dynamic segment اللي Angular بيحقنه
// في الـ component كـ @Input() أو عن طريق ActivatedRoute
// ─────────────────────────────────────────────────────────────────────────────
const routes: Routes = [
  {
    // /shop/classification/:id
    // المستخدم بيضغط على Classification من الـ home
    // → الصفحة دي بتعرض الـ SubClasses التابعة ليها
    path: 'classification/:id',
    component: ClassificationPageComponent
  },
  {
    // /shop/subclass/:id
    // المستخدم بيضغط على SubClass
    // → الصفحة دي بتعرض المنتجات المفلترة بالـ subClass ID
    path: 'subclass/:id',
    component: SubclassPageComponent
  },
  {
    // Fallback: لو حد وصل لـ /shop بدون path
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  declarations: [
    ClassificationPageComponent,
    SubclassPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)  // forChild ← مش forRoot — ده الـ Lazy module
  ]
})
export class ShopModule { }
