import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../layout.service';

export interface SidebarItem {
  labelAr: string;
  route?: string;
  icon: string;            // icon key → rendered via ngSwitch in template
  children?: { labelAr: string; route: string }[];
}

export interface SidebarSection {
  titleAr?: string;        // optional section header
  items: SidebarItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.html',
  styleUrl:    './sidebar.scss',
  standalone: false
})
export class SidebarComponent {
  private router = inject(Router);
  protected layout = inject(LayoutService);

  /** Which accordion keys are open */
  expanded = new Set<string>();

  sections: SidebarSection[] = [
    {
      items: [
        { labelAr: 'الرئيسية',               route: '/home',         icon: 'home'    },
        {
          labelAr: 'الزونات',                                         icon: 'bag',
          children: [
            { labelAr: 'زوبير زون',       route: '/zones/zubair-zone' },
            { labelAr: 'الزونات المتاحة', route: '/zones'             }
          ]
        },
        {
          labelAr: 'تسوقي حسب',                                       icon: 'percent',
          children: [
            { labelAr: 'مكملات صحية',           route: '/offers/health-supplements'  },
            { labelAr: 'مكياج واكسسوارات',       route: '/offers/makeup-accessories'  },
            { labelAr: 'تسوقي حسب المادة',       route: '/offers/shop-by-ingredient'  },
            { labelAr: 'مشاكل الشعر',            route: '/offers/hair-problems'        },
            { labelAr: 'مشاكل البشرة والجسم',    route: '/offers/skin-body-problems'  }
          ]
        },
        { labelAr: 'الماركات',               route: '/brands',       icon: 'star'    },
        { labelAr: 'دليل الروتينات',          route: '/routines',     icon: 'person'  },
        { labelAr: 'دليل استخدام التطبيق',    route: '/guide-book',  icon: 'bell'    },
        { labelAr: 'عروضنا',                  route: '/offers',       icon: 'tag'     }
      ]
    },
    {
      titleAr: 'الاستشارات',
      items: [
        { labelAr: 'الاستشارات',          route: '/medical-consults', icon: 'chat'   },
        { labelAr: 'الاستشارة المجانية',  route: '/free-consults',    icon: 'pencil' },
        { labelAr: 'استشارة طبية جلدية', route: '/derm-consults',    icon: 'face'   }
      ]
    },
    {
      titleAr: 'الموثوقية والجودة',
      items: [
        { labelAr: 'موثوق من زبير',   route: '/verified-zubair',   icon: 'verified'   },
        { labelAr: 'ضمان منتجاتنا',   route: '/product-guarantee', icon: 'guarantee'  }
      ]
    },
    {
      titleAr: 'شركاؤنا والمجتمع',
      items: [
        { labelAr: 'متاجر شركاءنا',           route: '/market-partners', icon: 'store'   },
        { labelAr: 'ساعدنا حتى نطور زبير',   route: '/help-improve',    icon: 'improve' }
      ]
    },
    {
      titleAr: 'المحتوى',
      items: [
        { labelAr: 'أسئلتكم المتكررة؟ جاوبناهم', route: '/faq', icon: 'faq' }
      ]
    },
    {
      titleAr: 'الإعدادات',
      items: [
        { labelAr: 'الإشعارات',     route: '/notifications',  icon: 'bellSettings' },
        { labelAr: 'سياسة التبديل', route: '/replace-policy', icon: 'swap'         },
        { labelAr: 'قصتنا',         route: '/our-story',      icon: 'story'        },
        { labelAr: 'منو احنا',      route: '/who-are-we',     icon: 'info'         },
        { labelAr: 'الدعم',         route: '/our-support',    icon: 'headphone'    }
      ]
    }
  ];

  toggle(key: string): void {
    if (this.expanded.has(key)) {
      this.expanded.delete(key);
    } else {
      this.expanded.add(key);
    }
  }

  isOpen(key: string): boolean {
    return this.expanded.has(key);
  }

  go(route: string): void {
    this.router.navigate([route]);
    this.layout.closeSidebar();
  }
}
