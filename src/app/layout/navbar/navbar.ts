import { Component, OnInit, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../layout.service';

export interface NavItem {
  label: string;
  labelAr: string;
  route?: string;
  children?: { label: string; labelAr: string; route: string }[];
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: false
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  protected layoutService = inject(LayoutService);

  activeDropdown: string | null = null;

  navItems: NavItem[] = [
    { label: 'home', labelAr: 'الرئيسية', route: '/home' },
    { label: 'categories', labelAr: 'الأقسام', route: '/categories' },
    {
      label: 'offers', labelAr: 'تسوقي حسب',
      children: [
        { label: 'health-supplements', labelAr: 'مكملات صحية', route: '/offers/health-supplements' },
        { label: 'makeup-accessories', labelAr: 'مكياج واكسسوارات', route: '/offers/makeup-accessories' },
        { label: 'shop-by-ingredient', labelAr: 'تسوقي حسب المادة', route: '/offers/shop-by-ingredient' },
        { label: 'hair-problems', labelAr: 'مشاكل الشعر', route: '/offers/hair-problems' },
        { label: 'skin-body-problems', labelAr: 'مشاكل البشرة والجسم', route: '/offers/skin-body-problems' }
      ]
    },
    { label: 'brands', labelAr: 'ماركاتنا', route: '/brands' },
    { label: 'products', labelAr: 'المنتجات', route: '/products' },
    { label: 'medical-consults', labelAr: 'الاستشارات', route: '/medical-consults' }
  ];

  ngOnInit(): void { }

  toggleDropdown(label: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeDropdown = this.activeDropdown === label ? null : label;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.layoutService.closeSidebar();
    this.activeDropdown = null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar__nav-item')) {
      this.activeDropdown = null;
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.layoutService.closeSidebar();
    this.activeDropdown = null;
  }
}
