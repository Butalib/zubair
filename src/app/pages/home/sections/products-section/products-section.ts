import { Component, Input, OnInit, signal } from '@angular/core';
import { Product } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-products-section',
  templateUrl: './products-section.html',
  styleUrl: './products-section.scss',
  standalone: false
})
export class ProductsSectionComponent implements OnInit {
  /** API endpoint relative to baseUrl, e.g. 'products?bestSeller=true&limit=5' */
  @Input() apiUrl!: string;
  /** Fallback URL if apiUrl returns empty */
  @Input() fallbackUrl?: string;
  /** Section eyebrow label */
  @Input() eyebrow = '';
  /** Section main title */
  @Input() title = '';
  /** CTA link */
  @Input() ctaLink = '/products';
  /** CTA label */
  @Input() ctaLabel = 'المزيد ←';
  /** Section background class e.g. 'home-section--cream' */
  @Input() bgClass = 'home-section--white';

  readonly products = signal<Product[]>([]);
  readonly loading = signal<boolean>(true);

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getData(this.apiUrl).subscribe({
      next: (res: any) => {
        const data = res?.data || [];
        if (data.length === 0 && this.fallbackUrl) {
          this.loadFallback();
        } else {
          this.products.set(data);
          this.loading.set(false);
        }
      },
      error: () => {
        if (this.fallbackUrl) {
          this.loadFallback();
        } else {
          this.loading.set(false);
        }
      }
    });

    // this.getDate()

  }
  // getDate() {
  //   this.dataService.getData(this.apiUrl).subscribe({
  //     next: (res: any) => {
  //       const data = res?.data || [];
  //       if (data.length === 0 && this.fallbackUrl) {
  //         this.loadFallback();
  //       } else {
  //         this.products.set(data);
  //         this.loading.set(false);
  //       }
  //     },
  //     error: () => {
  //       if (this.fallbackUrl) {
  //         this.loadFallback();
  //       } else {
  //         this.loading.set(false);
  //       }
  //     }
  //   });

  // }

  private loadFallback(): void {
    this.dataService.getData(this.fallbackUrl!).subscribe({
      next: (res: any) => {
        this.products.set(res?.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  getProductImage(product: Product): string {
    const img = product.imageCover || (product.images && product.images[0]);
    if (!img) return 'assets/images/logo.png';
    if (img.startsWith('http') || img.startsWith('assets/')) return img;
    return this.imageBaseUrl + img;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== 'assets/images/logo.png') {
      target.src = 'assets/images/logo.png';
    }
  }

  hasDiscount(product: Product): boolean {
    const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
    return !!discount && discount < product.price;
  }

  getDiscountPercent(product: Product): number {
    const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
    if (!discount || discount >= product.price) return 0;
    return Math.round(((product.price - discount) / product.price) * 100);
  }

  getFinalPrice(product: Product): number {
    return product.priceAfterDiscount ?? product.priceAfterdiscound ?? product.price;
  }
}
