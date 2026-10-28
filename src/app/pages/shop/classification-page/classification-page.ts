import { Component, OnInit, OnDestroy, signal, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse, Classification, Product, SubClass } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';
import {
  ClassificationService,
  KNOWN_CLASSIFICATION_SLUGS
} from 'src/app/core/services/classification/classification.service';

// ─── ليه بنجيب الـ SubClasses بدل ما نجيب الـ Products مباشرة؟ ───────────────
// الـ Classification هي "مكياج" أو "صحة" — مستوى تصنيف عالي جداً
// الـ SubClass هي "Vitamin C" أو "Omega-3" — المستوى اللي فيه منتجات محددة
// فالمنطق: Classification → SubClasses → Products
// اليوزر محتاج يختار SubClass الأول عشان يشوف المنتجات
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-classification-page',
  templateUrl: './classification-page.html',
  styleUrl: './classification-page.scss',
  standalone: false
})
export class ClassificationPageComponent implements OnInit, OnDestroy {

  // ─── State Signals ─────────────────────────────────────────────────────────
  readonly classification = signal<Classification | null>(null);
  readonly headerTitle = signal('التصنيف');
  readonly subclasses = signal<SubClass[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  // ─── Route Input ───────────────────────────────────────────────────────────
  @Input() set id(classificationId: string) {
    if (classificationId) {
      this._classificationId = classificationId;
      this.loadData(classificationId);
    }
  }

  private _classificationId: string = '';
  private subs = new Subscription();

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  constructor(
    private dataService: DataService,
    private classificationService: ClassificationService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this._classificationId) {
      this.subs.add(
        this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
            this._classificationId = id;
            this.loadData(id);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ─── Load Classification + SubClasses ─────────────────────────────────────
  // يدعم كلاً من الـ MongoDB ID أو الـ Slug
  loadData(idOrSlug: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.headerTitle.set(this.getInitialTitle(idOrSlug));

    const isMongoId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);

    if (isMongoId) {
      this.fetchDirectly(idOrSlug);
    } else {
      // Slug أو اسم: نبحث عنه في التصنيفات
      this.subs.add(
        this.classificationService.getClassifications().subscribe(list => {
          const matched = this.classificationService.findClassification(idOrSlug, list);
          if (matched) {
            this.classification.set(matched);
            this.fetchSubclasses(matched._id);
          } else {
            this.fetchDirectly(idOrSlug);
          }
        })
      );
    }
  }

  private getInitialTitle(idOrSlug: string): string {
    return KNOWN_CLASSIFICATION_SLUGS[idOrSlug.toLowerCase()] || 'التصنيف';
  }

  private fetchDirectly(id: string): void {
    // جلب بيانات التصنيف
    this.subs.add(
      this.dataService
        .getData<ApiResponse<Classification>>(`classification/${id}`, 8000)
        .subscribe({
          next: (res) => {
            this.classification.set(res?.data || null);
          },
          error: () => { }
        })
    );

    // جلب الـ SubClasses التابعة له
    this.fetchSubclasses(id);
  }

  private fetchSubclasses(classificationId: string): void {
    this.subs.add(
      this.dataService
        .getData<ApiResponse<SubClass[]>>(`subclass?classification=${classificationId}&limit=50`, 8000)
        .subscribe({
          next: (res) => {
            const list = res?.data || [];
            this.loadProductCounts(list);
            this.isLoading.set(false);
          },
          error: () => {
            this.hasError.set(true);
            this.isLoading.set(false);
          }
        })
    );
  }

  private loadProductCounts(list: SubClass[]): void {
    if (list.length === 0 || list.every(subclass => subclass.productCount !== undefined)) {
      this.subclasses.set(list);
      return;
    }

    forkJoin(
      list.map(subclass =>
        subclass.productCount !== undefined
          ? of(subclass.productCount)
          : this.dataService
            .getData<ApiResponse<Product[]>>(`products?subClass=${subclass._id}&limit=1`, 8000)
            .pipe(
              map(response => response?.results ?? 0),
              catchError(error => {
                console.error(`Failed to load product count for subclass ${subclass._id}`, error);
                return of(undefined);
              })
            )
      )
    ).subscribe(counts => {
      this.subclasses.set(
        list.map((subclass, index) => ({
          ...subclass,
          productCount: counts[index]
        }))
      );
    });
  }

  // ─── Navigate to SubClass Products ────────────────────────────────────────
  // لما اليوزر يضغط على SubClass Card، نروح لصفحة المنتجات
  goToSubclass(subclass: SubClass): void {
    this.router.navigate(['/shop/subclass', subclass._id]);
  }

  retry(): void {
    this.loadData(this._classificationId);
  }

  getSubclassImage(subclass: SubClass): string {
    if (!subclass.image) return 'assets/images/logo.png';
    if (subclass.image.startsWith('http') || subclass.image.startsWith('assets/')) {
      return subclass.image;
    }
    return this.imageBaseUrl + subclass.image;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.src = 'assets/images/logo.png';
  }

  // ─── trackBy ─────────────────────────────────────────────────────────────
  // *ngFor بيستخدمه عشان يعرف ايه العناصر اللي اتغيرت
  // بدله Angular هيعيد render كل الـ DOM عند أي تغيير في الـ array
  // ─────────────────────────────────────────────────────────────────────────
  trackById(_index: number, item: SubClass): string {
    return item._id;
  }
}
