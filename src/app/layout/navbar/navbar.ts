import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavItem } from 'src/app/core/interfaces/project-interfaces';
import { LayoutService } from '../layout.service';
import { ClassificationService } from 'src/app/core/services/classification/classification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  protected layoutService = inject(LayoutService);
  private classificationService = inject(ClassificationService);

  private sub = new Subscription();
  activeDropdown: string | null = null;

  navItems: NavItem[] = [
    { label: 'home', labelAr: 'الرئيسية', route: '/home' },
    { label: 'categories', labelAr: 'الأقسام', route: '/categories' },
    {
      label: 'offers', labelAr: 'تسوقي حسب',
      children: [
        { label: 'health-supplements', labelAr: 'مكملات صحية', route: '/shop/classification/health-supplements' },
        { label: 'makeup-accessories', labelAr: 'مكياج واكسسوارات', route: '/shop/classification/makeup-accessories' },
        { label: 'shop-by-ingredient', labelAr: 'تسوقي حسب المادة', route: '/shop/classification/shop-by-ingredient' },
        { label: 'hair-problems', labelAr: 'مشاكل الشعر', route: '/shop/classification/hair-problems' },
        { label: 'skin-body-problems', labelAr: 'مشاكل البشرة والجسم', route: '/shop/classification/skin-body-problems' }
      ]
    },
    { label: 'brands', labelAr: 'ماركاتنا', route: '/brands' },
    { label: 'products', labelAr: 'المنتجات', route: '/products' },
    { label: 'medical-consults', labelAr: 'الاستشارات', route: '/medical-consults' }
  ];

  ngOnInit(): void {
    this.sub.add(
      this.classificationService.getClassifications().subscribe(classifications => {
        const offersItem = this.navItems.find(i => i.label === 'offers' || i.labelAr === 'تسوقي حسب');
        if (offersItem && classifications.length > 0) {
          offersItem.children = classifications.map(c => ({
            label: c._id,
            labelAr: c.name,
            route: `/shop/classification/${c._id}`
          }));
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

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
