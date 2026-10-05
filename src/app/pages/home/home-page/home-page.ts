import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data/data.service';

interface HeroSlide {
  image: string;
  link: string;
}

interface Category {
  _id: string;
  name: string;
  image: string;
  slug?: string;
}

interface Classification {
  _id: string;
  name: string;
  image: string;
  active: boolean;
}

interface Brand {
  _id: string;
  name: string;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  priceAfterDiscount?: number;
  images?: string[];
  imageCover?: string;
  brand?: { name: string };
  slug?: string;
}

interface FeatureItem {
  icon: string;
  text: string;
}

interface PromoBanner {
  eyebrow: string;
  title: string;
  highlight: string;
  desc: string;
  cta: string;
  link: string;
  theme: 'navy' | 'bronze';
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: false
})
export class HomePageComponent implements OnInit {

  // Hero
  heroSlides: HeroSlide[] = [
    { image: 'assets/images/hero/img-1786297750833.jpeg', link: '/home' },
    { image: 'assets/images/hero/img-1786297769174.jpeg', link: '/home' },
    { image: 'assets/images/hero/img-1786297901417.jpeg', link: '/home' },
  ];

  // Feature bar items
  features: FeatureItem[] = [
    { icon: '🚚', text: 'توصيل سريع لجميع المحافظات' },
    { icon: '✅', text: 'منتجات أصلية 100%' },
    { icon: '💳', text: 'الدفع عند الاستلام' },
    { icon: '🔄', text: 'سياسة إرجاع مرنة' },
    { icon: '🎁', text: 'عروض وخصومات مستمرة' },
    { icon: '📞', text: 'دعم فني متواصل' },
  ];

  // Promo banners
  promoBanners: PromoBanner[] = [
    {
      eyebrow: 'وصل حديثاً',
      title: 'أحدث',
      highlight: 'إصدارات 2026',
      desc: 'مجموعات جديدة وصلت للتو من أفضل الماركات العالمية',
      cta: 'اكتشفي الجديد ←',
      link: '/products/new',
      theme: 'navy'
    },
    {
      eyebrow: 'عرض خاص',
      title: 'مجموعة',
      highlight: 'العناية الذهبية',
      desc: 'منتجات عناية بالبشرة مختارة بعناية — خصم يصل إلى 30%',
      cta: 'تسوقي الآن ←',
      link: '/offers',
      theme: 'bronze'
    }
  ];

  // Data from API
  categories: Category[] = [];
  classifications: Classification[] = [];
  brands: Brand[] = [];
  featuredProducts: Product[] = [];
  newProducts: Product[] = [];
  selectedProducts: Product[] = [];
  restockedProducts: Product[] = [];

  // Loading states
  loadingCategories = true;
  loadingClassifications = true;
  loadingBrands = true;
  loadingFeatured = true;
  loadingNew = true;
  loadingSelected = true;
  loadingRestocked = true;

  // Newsletter
  newsletterEmail = '';
  newsletterMessage = '';
  newsletterStatus: 'idle' | 'success' | 'error' = 'idle';

  // Image base URL
  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadClassifications();
    this.loadBrands();
    this.loadFeaturedProducts();
    this.loadNewProducts();
    this.loadSelectedProducts();
    this.loadRestockedProducts();
  }

  private loadCategories(): void {
    this.dataService.getData('category').subscribe({
      next: (res: any) => {
        this.categories = res?.data || [];
        this.loadingCategories = false;
      },
      error: () => this.loadingCategories = false
    });
  }

  private loadClassifications(): void {
    this.dataService.getData('classification').subscribe({
      next: (res: any) => {
        this.classifications = res?.data || [];
        this.loadingClassifications = false;
      },
      error: () => this.loadingClassifications = false
    });
  }

  private loadBrands(): void {
    this.dataService.getData('brand').subscribe({
      next: (res: any) => {
        this.brands = res?.data || [];
        this.loadingBrands = false;
      },
      error: () => this.loadingBrands = false
    });
  }

  private loadFeaturedProducts(): void {
    this.dataService.getData('product?featured=true&limit=5').subscribe({
      next: (res: any) => {
        this.featuredProducts = res?.data || [];
        this.loadingFeatured = false;
      },
      error: () => this.loadingFeatured = false
    });
  }

  private loadNewProducts(): void {
    this.dataService.getData('product?sort=-createdAt&limit=5').subscribe({
      next: (res: any) => {
        this.newProducts = res?.data || [];
        this.loadingNew = false;
      },
      error: () => this.loadingNew = false
    });
  }

  private loadSelectedProducts(): void {
    this.dataService.getData('product?selected=true&limit=5').subscribe({
      next: (res: any) => {
        this.selectedProducts = res?.data || [];
        this.loadingSelected = false;
      },
      error: () => this.loadingSelected = false
    });
  }

  private loadRestockedProducts(): void {
    this.dataService.getData('product?restocked=true&limit=5').subscribe({
      next: (res: any) => {
        this.restockedProducts = res?.data || [];
        this.loadingRestocked = false;
      },
      error: () => this.loadingRestocked = false
    });
  }

  getProductImage(product: Product): string {
    if (product.imageCover) {
      return this.imageBaseUrl + product.imageCover;
    }
    if (product.images && product.images.length > 0) {
      return this.imageBaseUrl + product.images[0];
    }
    return 'assets/images/logo.png';
  }

  getClassificationImage(classification: Classification): string {
    return this.imageBaseUrl + classification.image;
  }

  getCategoryImage(category: Category): string {
    if (category.image) {
      return this.imageBaseUrl + category.image;
    }
    return 'assets/images/logo.png';
  }

  hasDiscount(product: Product): boolean {
    return !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  }

  getDiscountPercent(product: Product): number {
    if (!this.hasDiscount(product)) return 0;
    return Math.round(((product.price - product.priceAfterDiscount!) / product.price) * 100);
  }

  submitNewsletter(): void {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      this.newsletterMessage = 'يرجى إدخال بريد إلكتروني صحيح';
      this.newsletterStatus = 'error';
      return;
    }
    // Simulate subscription
    this.newsletterMessage = 'تم الاشتراك بنجاح! شكراً لك 🎉';
    this.newsletterStatus = 'success';
    this.newsletterEmail = '';
  }
}
