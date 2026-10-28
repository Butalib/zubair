import { Component, OnInit, OnDestroy, signal, computed, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  ApiResponse, SubClass, Product, DisplayProduct,
  PaginationResult, SortOption
} from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

// ─── ليه بنعمل صفحة منفصلة للـ SubClass؟ ────────────────────────────────────
// ده نفس الـ Categories Page في المنطق لكن بيفلتر بـ subClass ID
// الفصل ده بيسمح لكل صفحة تتطور مستقلة (مثلاً SubClass ممكن يضيف filters إضافية)
// ─────────────────────────────────────────────────────────────────────────────
@Component({
  selector: 'app-subclass-page',
  templateUrl: './subclass-page.html',
  styleUrl: './subclass-page.scss',
  standalone: false
})
export class SubclassPageComponent implements OnInit, OnDestroy {

  // ─── State Signals ─────────────────────────────────────────────────────────
  readonly subclass = signal<SubClass | null>(null);
  readonly headerTitle = signal('المنتجات');
  readonly products = signal<Product[]>([]);
  readonly pagination = signal<PaginationResult | null>(null);
  readonly isLoadingMeta = signal<boolean>(true);   // loading الـ subclass info
  readonly isLoadingProducts = signal<boolean>(true); // loading الـ products
  readonly hasError = signal<boolean>(false);
  readonly wishlistedProductIds = signal<Set<string>>(new Set());

  // ─── Computed: Display Products ────────────────────────────────────────────
  // computed() = يتحسب تلقائياً كلما تغير products() أو wishlistedProductIds()
  // ده مش بيعمل API call تاني — مجرد transformation للبيانات الموجودة
  // ─────────────────────────────────────────────────────────────────────────────
  readonly displayedProducts = computed<DisplayProduct[]>(() => {
    const wishlist = this.wishlistedProductIds();
    return this.products().map((p) => {
      const discount = p.priceAfterDiscount ?? p.priceAfterdiscound;
      const hasDiscount = !!discount && discount < p.price;
      const finalPrice = hasDiscount ? discount! : p.price;
      const isLimited = typeof p.quantity === 'number' && p.quantity > 0 && p.quantity <= 5;

      const img = p.imageCover || p.images?.[0];
      const imageUrl = img
        ? (img.startsWith('http') || img.startsWith('assets/') ? img : this.imageBaseUrl + img)
        : 'assets/images/logo.png';

      return { ...p, imageUrl, isWishlisted: wishlist.has(p._id), isLimited, hasDiscount, finalPrice };
    });
  });

  // ─── Sort Options ──────────────────────────────────────────────────────────
  readonly sortOptions: readonly SortOption[] = [
    { value: '', label: 'الكل' },
    { value: '-createdAt', label: 'الأحدث' },
    { value: 'price', label: 'الأقل سعراً' },
    { value: '-price', label: 'الأعلى سعراً' },
    { value: '-sold', label: 'الأكثر طلباً' }
  ];

  // ─── Route Input ──────────────────────────────────────────────────────────
  @Input() set id(subclassId: string) {
    if (subclassId && subclassId !== this._subclassId) {
      this._subclassId = subclassId;
      this.resetFilters();
      this.loadData(subclassId);
    }
  }

  private _subclassId: string = '';

  // Filter & Search state
  searchTerm: string = '';
  selectedSort: string = '';
  currentPage: number = 1;
  private readonly searchSubject = new Subject<string>();
  private subs = new Subscription();

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupSearchDebounce();

    // Fallback لو الـ bindToComponentInputs مش شغال
    if (!this._subclassId) {
      this.subs.add(
        this.route.params.subscribe(params => {
          const id = params['id'];
          if (id) {
            this._subclassId = id;
            this.resetFilters();
            this.loadData(id);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ─── Search Debounce ───────────────────────────────────────────────────────
  // Debounce = ما ترسلش API call مع كل ضغطة كيبورد
  // بننتظر 350ms بعد آخر ضغطة، ده بيقلل الـ API calls بشكل كبير
  private setupSearchDebounce(): void {
    this.subs.add(
      this.searchSubject
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(term => {
          this.searchTerm = term;
          this.currentPage = 1;
          this.loadProducts();
        })
    );
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  onSortChange(sortValue: string): void {
    this.selectedSort = sortValue;
    this.currentPage = 1;
    this.loadProducts();
  }

  private resetFilters(): void {
    this.searchTerm = '';
    this.selectedSort = '';
    this.currentPage = 1;
  }

  // ─── Load Data ─────────────────────────────────────────────────────────────
  loadData(subclassId: string): void {
    this.isLoadingMeta.set(true);
    this.hasError.set(false);
    this.headerTitle.set('المنتجات');

    // جيب الـ SubClass info للـ header
    this.subs.add(
      this.dataService
        .getData<ApiResponse<SubClass>>(`subclass/${subclassId}`, 8000)
        .subscribe({
          next: (res) => {
            this.subclass.set(res?.data || null);
            this.isLoadingMeta.set(false);
          },
          error: () => { this.isLoadingMeta.set(false); }
        })
    );

    // جيب الـ Products
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoadingProducts.set(true);

    // بنبني الـ query string بشكل تراكمي
    // subClass= هو الـ filter الأساسي — الباقي إضافي
    let query = `products?page=${this.currentPage}&limit=12&subClass=${this._subclassId}`;

    if (this.searchTerm) {
      query += `&keyword=${encodeURIComponent(this.searchTerm)}`;
    }
    if (this.selectedSort) {
      query += `&sort=${this.selectedSort}`;
    }

    this.subs.add(
      this.dataService.getData<ApiResponse<Product[]>>(query, 8000).subscribe({
        next: (res) => {
          this.products.set(res?.data || []);
          this.pagination.set(res?.paginationResult ?? null);
          this.isLoadingProducts.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.products.set([]);
          this.isLoadingProducts.set(false);
        }
      })
    );
  }

  // ─── Wishlist Toggle (Optimistic UI) ──────────────────────────────────────
  // Optimistic UI: بنحدث الـ UI فوراً بدل ما ننتظر الـ API
  // لو الـ API فشل → بنعكس التغيير (في المستقبل مع WishlistService)
  toggleWishlist(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const current = new Set(this.wishlistedProductIds());
    if (current.has(product._id)) {
      current.delete(product._id);
    } else {
      current.add(product._id);
    }
    this.wishlistedProductIds.set(current);
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // TODO: inject CartService وبنضيف المنتج للـ cart
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.classList.add('btn-added');
      setTimeout(() => target.classList.remove('btn-added'), 700);
    }
  }

  goToProduct(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  retry(): void {
    this.loadData(this._subclassId);
  }

  // ─── Pagination ────────────────────────────────────────────────────────────
  goToPage(page: number): void {
    const p = this.pagination();
    if (!p || page < 1 || page > p.numberOfPages) return;
    this.currentPage = page;
    this.loadProducts();
    document.getElementById('products-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get totalPages(): number { return this.pagination()?.numberOfPages ?? 0; }
  get hasPrev(): boolean { return this.currentPage > 1; }
  get hasNext(): boolean {
    const p = this.pagination();
    return !!p && this.currentPage < p.numberOfPages;
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: number[] = [1];
    const cur = this.currentPage;
    if (cur > 3) pages.push(-1);
    const start = Math.max(2, cur - 1);
    const end = Math.min(total - 1, cur + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (cur < total - 2) pages.push(-1);
    pages.push(total);
    return pages;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) target.src = 'assets/images/logo.png';
  }

  trackById(_index: number, item: { _id: string }): string {
    return item._id;
  }
}
