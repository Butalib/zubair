import { Component } from '@angular/core';
import { Category, FeatureItem, HeroSlide, PromoBanner } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: false
})
export class HomePageComponent {

  //   Hero        
  heroSlides: HeroSlide[] = [
    { image: 'assets/images/hero/img-1786297901417.jpeg', link: '/home' },
    { image: 'assets/images/hero/img-1786297750833.jpeg', link: '/home' },
    { image: 'assets/images/hero/img-1786297769174.jpeg', link: '/home' },
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

  //   Categories (pre-populated; syncs _id from API in ngOnInit)  ─
  loadingCategories = false;
  categories: Category[] = [
    { _id: '68da558cfe5f1a754b4a0049', name: 'واقيات الشمس', image: 'assets/images/categories/img-1761719564265.jpeg' },
    { _id: '68da5599fe5f1a754b4a0052', name: 'منتجات كورية', image: 'assets/images/categories/img-1759139451091.jpeg' },
    { _id: '68da55b0fe5f1a754b4a0063', name: 'إزالة المكياج', image: 'assets/images/categories/img-1759139461782.jpeg' },
    { _id: '6901c4df6d907a8283898242', name: 'غسولات', image: 'assets/images/categories/img-1761720560532.jpeg' },
    { _id: '68f9d98b134b4c25d424d6da', name: 'غسولات زيتية', image: 'assets/images/categories/img-1761720923492.jpeg' }
  ];

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

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // Only categories are loaded here — they are above the fold
    this.dataService.getData('categories').subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.categories = this.categories.map(localCat => {
            const remoteCat = res.data.find((c: any) => c.name?.trim() === localCat.name?.trim());
            return remoteCat ? { ...localCat, _id: remoteCat._id } : localCat;
          });
        }
        this.loadingCategories = false;
      },
      error: () => { this.loadingCategories = false; }
    });
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
