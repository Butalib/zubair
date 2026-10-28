import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse, Category, FeatureItem, HeroSlide, PromoBanner } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: false
})
export class HomePageComponent implements OnInit, OnDestroy {

  //   Hero        
  heroSlides: HeroSlide[] = [
    {
      image: 'assets/images/hero/img-1786297901417.jpeg',
      link: '/products',
      title: 'مجموعة 2026 الحصرية للعناية والجمال',
      priority: 'high'
    },
    {
      image: 'assets/images/hero/img-1786297750833.jpeg',
      link: '/categories',
      title: 'أفضل منتجات العناية بالبشرة والشعر'
    },
    {
      image: 'assets/images/hero/img-1786297769174.jpeg',
      link: '/products/new',
      title: 'إصدارات جديدة وصلت حديثاً'
    },
  ];

  //   Feature bar marquee      
  features: FeatureItem[] = [
    { text: 'مدة التوصيل لجميع محافظات العراق 2 يوم اما البصرة واطرافها 1 يوم' },
    { text: 'الاجور لجميع المحافظات 5 الاف اما البصرة 3 الاف واطرافها 4 الاف' },
  ];

  private _repeatedFeatures: FeatureItem[] = [];
  get repeatedFeatures(): FeatureItem[] {
    if (this._repeatedFeatures.length) return this._repeatedFeatures;
    if (!this.features || this.features.length === 0) return [];
    let list: FeatureItem[] = [];
    while (list.length < 6) {
      list = list.concat(this.features);
    }
    this._repeatedFeatures = list;
    return this._repeatedFeatures;
  }

  //   Promo banners (static — no API needed)     
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

  //   Categories (server-driven)
  private readonly MAX_CATEGORIES = 5;
  readonly categories = signal<Category[]>([]);
  readonly loadingCategories = signal<boolean>(true);
  readonly categoriesError = signal<boolean>(false);

  private readonly localCategoryImages: Record<string, string> = {
    'img-1759139451091.jpeg': 'assets/images/categories/img-1759139451091.jpeg',
    'img-1759139461782.jpeg': 'assets/images/categories/img-1759139461782.jpeg',
    'img-1761719564265.jpeg': 'assets/images/categories/img-1761719564265.jpeg',
    'img-1761720560532.jpeg': 'assets/images/categories/img-1761720560532.jpeg',
    'img-1761720923492.jpeg': 'assets/images/categories/img-1761720923492.jpeg'
  };

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  //   Newsletter       
  newsletterEmail = '';
  newsletterMessage = '';
  newsletterStatus: 'idle' | 'success' | 'error' = 'idle';

  private categoriesSub?: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
  }

  loadCategories(): void {
    this.categoriesSub?.unsubscribe();
    this.loadingCategories.set(true);
    this.categoriesError.set(false);

    this.categoriesSub = this.dataService.getData<ApiResponse<Category[]>>('categories').subscribe({
      next: (res) => {
        if (res?.data && Array.isArray(res.data)) {
          this.categories.set(res.data.slice(0, this.MAX_CATEGORIES));
        } else {
          this.categories.set([]);
        }
        this.categoriesError.set(false);
        this.loadingCategories.set(false);
      },
      error: () => {
        this.categoriesError.set(true);
        this.loadingCategories.set(false);
      }
    });
  }

  retryCategories(): void {
    this.loadCategories();
  }

  getCategoryImage(category: Category): string {
    if (!category.image) return 'assets/images/logo.png';
    if (category.image.startsWith('http') || category.image.startsWith('assets/')) return category.image;
    if (this.localCategoryImages[category.image]) return this.localCategoryImages[category.image];
    return this.imageBaseUrl + category.image;
  }

  onImgError(event: Event, fallbackPath: string = 'assets/images/logo.png'): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== fallbackPath) {
      target.src = fallbackPath;
    }
  }

  submitNewsletter(): void {
    if (!this.newsletterEmail || !this.newsletterEmail.includes('@')) {
      this.newsletterMessage = 'يرجى إدخال بريد إلكتروني صحيح';
      this.newsletterStatus = 'error';
      return;
    }
    this.newsletterMessage = 'تم الاشتراك بنجاح! شكراً لك 🎉';
    this.newsletterStatus = 'success';
    this.newsletterEmail = '';
  }
}
