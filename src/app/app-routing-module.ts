import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { HomeLayoutComponent } from './layout/home-layout/home-layout';

const routes: Routes = [
  //   Auth Routes (no layout wrapper) 
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
  },

  //   Home (special layout, full-width)  
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeLayoutComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/home/home-module').then(m => m.HomeModule)
          }
        ]
      },

      //   Zones  
      //   {
      //     path: 'zones',
      //     loadChildren: () => import('./pages/zones/zones-module').then(m => m.ZonesModule)
      //   },

      //   //   Offers / Shop by      
      //   {
      //     path: 'offers',
      //     loadChildren: () => import('./pages/offers/offers-module').then(m => m.OffersModule)
      //   },

      //   //   Brands           
      //   {
      //     path: 'brands',
      //     loadChildren: () => import('./pages/brands/brands-module').then(m => m.BrandsModule)
      //   },

      //   //   Routines          
      //   {
      //     path: 'routines',
      //     loadChildren: () => import('./pages/routines/routines-module').then(m => m.RoutinesModule)
      //   },

      //   //   Guide Book         
      //   {
      //     path: 'guide-book',
      //     loadChildren: () => import('./pages/guide-book/guide-book-module').then(m => m.GuideBookModule)
      //   },

      //   //   Consults          
      //   {
      //     path: 'medical-consults',
      //     loadChildren: () => import('./pages/consults/consults-module').then(m => m.ConsultsModule)
      //   },
      //   {
      //     path: 'free-consults',
      //     loadChildren: () => import('./pages/consults/consults-module').then(m => m.ConsultsModule)
      //   },
      //   {
      //     path: 'derm-consults',
      //     loadChildren: () => import('./pages/consults/consults-module').then(m => m.ConsultsModule)
      //   },

      //   //   Trust & Quality      ─
      //   {
      //     path: 'verified-zubair',
      //     loadChildren: () => import('./pages/trust/trust-module').then(m => m.TrustModule)
      //   },
      //   {
      //     path: 'product-guarantee',
      //     loadChildren: () => import('./pages/trust/trust-module').then(m => m.TrustModule)
      //   },

      //   //   Partners & Community    
      //   {
      //     path: 'market-partners',
      //     loadChildren: () => import('./pages/partners/partners-module').then(m => m.PartnersModule)
      //   },
      //   {
      //     path: 'help-improve',
      //     loadChildren: () => import('./pages/help/help-module').then(m => m.HelpModule)
      //   },

      //   //   Content          ─
      //   {
      //     path: 'faq',
      //     loadChildren: () => import('./pages/faq/faq-module').then(m => m.FaqModule)
      //   },

      //   //   Settings          
      //   {
      //     path: 'notifications',
      //     loadChildren: () => import('./pages/notifications/notifications-module').then(m => m.NotificationsModule)
      //   },
      //   {
      //     path: 'replace-policy',
      //     loadChildren: () => import('./pages/policy/policy-module').then(m => m.PolicyModule)
      //   },

      //   //   Our Story         ─
      //   {
      //     path: 'who-are-we',
      //     loadChildren: () => import('./pages/about/about-module').then(m => m.AboutModule)
      //   },
      //   {
      //     path: 'our-support',
      //     loadChildren: () => import('./pages/support/support-module').then(m => m.SupportModule)
      //   }
    ]
  },

  //   Default redirect         
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
