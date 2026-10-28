import { Component, OnDestroy, OnInit, signal, computed, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiResponse, Category, PaginationResult, Product, DisplayProduct, SortOption } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';


@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.html',
  styleUrl: './categories-page.scss',
  standalone: false
})
export class CategoriesPageComponent implements OnInit, OnDestroy {

  // State Signals
  readonly categories = signal<Category[]>([]);
  readonly selectedCategory = signal<Category | null>(null);
  readonly products = signal<Product[]>([]);
  readonly pagination = signal<PaginationResult | null>(null);

  readonly loadingCategories = signal<boolean>(true);
  readonly loadingProducts = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);
  readonly wishlistedProductIds = signal<Set<string>>(new Set());

  // Derived Presentation State (Display Only)
  readonly displayedProducts = computed<DisplayProduct[]>(() => {
    const wishlist = this.wishlistedProductIds();
    return this.products().map((product) => {
      const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
      const hasDiscount = !!discount && discount < product.price;
      const finalPrice = (hasDiscount ? discount : product.price) ?? product.price;
      const isLimited = (product.quantity !== undefined && product.quantity > 0 && product.quantity <= 5) || product.quantity === 0;

      const img = product.imageCover || (product.images && product.images[0]);
      let imageUrl = 'assets/images/logo.png';
      if (img) {
        imageUrl = (img.startsWith('http') || img.startsWith('assets/')) ? img : this.imageBaseUrl + img;
      }

      return {
        ...product,
        imageUrl,
        isWishlisted: wishlist.has(product._id),
        isLimited,
        hasDiscount,
        finalPrice
      };
    });
  });

  // Sort Options List
  readonly sortOptions: readonly SortOption[] = [
    { value: '', label: 'الكل' },
    { value: '-createdAt', label: 'الأحدث' },
    { value: 'price', label: 'الأقل سعراً' },
    { value: '-price', label: 'الأعلى سعراً' },
    { value: '-sold', label: 'الأكثر طلباً' }
  ];

  // Router input binding (via withComponentInputBinding / bindToComponentInputs)
  @Input() set category(catId: string | undefined) {
    this.routeCategoryId = catId || null;
    if (catId && this.categories().length > 0) {
      const matched = this.categories().find((c) => c._id === catId);
      if (matched && this.selectedCategory()?._id !== matched._id) {
        this.selectCategory(matched, false);
      }
    }
  }
  get category(): string | undefined {
    return this.routeCategoryId || undefined;
  }
  private routeCategoryId: string | null = null;

  // Search & Filter state
  searchTerm: string = '';
  selectedSort: string = '';
  currentPage: number = 1;
  private readonly searchSubject = new Subject<string>();

  // Image Fallbacks & Base URLs
  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';
  private readonly localCategoryImages: Record<string, string> = {
    'img-1759139451091.jpeg': 'assets/images/categories/img-1759139451091.jpeg',
    'img-1759139461782.jpeg': 'assets/images/categories/img-1759139461782.jpeg',
    'img-1761719564265.jpeg': 'assets/images/categories/img-1761719564265.jpeg',
    'img-1761720560532.jpeg': 'assets/images/categories/img-1761720560532.jpeg',
    'img-1761720923492.jpeg': 'assets/images/categories/img-1761720923492.jpeg'
  };

  private subs: Subscription = new Subscription();
  private categoriesSub?: Subscription;
  private productsSub?: Subscription;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setupSearchDebounce();
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.categoriesSub?.unsubscribe();
    this.productsSub?.unsubscribe();
  }

  private setupSearchDebounce(): void {
    this.subs.add(
      this.searchSubject
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe((term) => {
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

  loadCategories(): void {
    this.categoriesSub?.unsubscribe();
    this.loadingCategories.set(true);
    this.hasError.set(false);

    // Call getAllCategoriesWithProduct endpoint to get categories with productCount
    this.categoriesSub = this.dataService
      .getData<ApiResponse<Category[]>>('categories/getAllCategoriesWithProduct', 8000)
      .subscribe({
          next: (res) => {
            const list = res?.data || [];
            this.categories.set(list);
            this.loadingCategories.set(false);

            // Check if there is a category ID passed from route input
            if (this.routeCategoryId) {
              const matched = list.find((c) => c._id === this.routeCategoryId);
              if (matched) {
                this.selectCategory(matched, false);
                return;
              }
            }

            if (list.length > 0) {
              this.selectCategory(list[0], false);
            } else {
              this.loadProducts();
            }
          },
          error: () => {
            // Fallback to standard categories endpoint if getAllCategoriesWithProduct is not reached
            this.categoriesSub = this.dataService.getData<ApiResponse<Category[]>>('categories', 8000).subscribe({
              next: (fallbackRes) => {
                const list = fallbackRes?.data || [];
                this.categories.set(list);
                this.loadingCategories.set(false);
                if (this.routeCategoryId) {
                  const matched = list.find((c) => c._id === this.routeCategoryId);
                  if (matched) {
                    this.selectCategory(matched, false);
                    return;
                  }
                }
                if (list.length > 0) {
                  this.selectCategory(list[0], false);
                } else {
                  this.loadProducts();
                }
              },
              error: () => {
                this.hasError.set(true);
                this.loadingCategories.set(false);
                this.loadingProducts.set(false);
              }
            });
          }
        });
  }

  selectCategory(category: Category | null, syncRoute: boolean = true): void {
    this.selectedCategory.set(category);
    this.currentPage = 1;
    this.searchTerm = '';

    if (syncRoute && category?._id) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: category._id },
        queryParamsHandling: 'merge'
      });
    }

    this.loadProducts();
  }

  loadProducts(): void {
    this.productsSub?.unsubscribe();
    this.loadingProducts.set(true);

    let query = `products?page=${this.currentPage}&limit=12`;

    const cat = this.selectedCategory();
    if (cat?._id) {
      query += `&category=${cat._id}`;
    }

    if (this.searchTerm) {
      query += `&keyword=${encodeURIComponent(this.searchTerm)}`;
    }

    if (this.selectedSort) {
      query += `&sort=${this.selectedSort}`;
    }

    this.productsSub = this.dataService.getData<ApiResponse<Product[]>>(query, 8000).subscribe({
        next: (res) => {
          this.products.set(res?.data || []);
          this.pagination.set(res?.paginationResult ?? null);
          this.loadingProducts.set(false);
        },
        error: () => {
          this.products.set([]);
          this.loadingProducts.set(false);
        }
      });
  }

  retry(): void {
    this.loadCategories();
  }

  goToPage(page: number): void {
    const p = this.pagination();
    if (!p || page < 1 || page > p.numberOfPages) return;
    this.currentPage = page;
    this.loadProducts();

    // Scroll back to products header smoothly
    const container = document.getElementById('products-stage');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

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

  isWishlisted(productId: string): boolean {
    return this.wishlistedProductIds().has(productId);
  }

  addToCart(product: Product, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    // Provide visual feedback for adding to cart
    const target = event.currentTarget as HTMLElement;
    if (target) {
      target.classList.add('btn-added');
      setTimeout(() => target.classList.remove('btn-added'), 700);
    }
  }

  get totalPages(): number {
    return this.pagination()?.numberOfPages ?? 0;
  }

  get hasPrev(): boolean {
    return this.currentPage > 1;
  }

  get hasNext(): boolean {
    const p = this.pagination();
    return !!p && this.currentPage < p.numberOfPages;
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    const cur = this.currentPage;

    if (cur > 3) pages.push(-1); // ellipsis
    const start = Math.max(2, cur - 1);
    const end = Math.min(total - 1, cur + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (cur < total - 2) pages.push(-1); // ellipsis
    pages.push(total);

    return pages;
  }

  getCategoryImage(category: Category): string {
    if (!category.image) return 'assets/images/logo.png';
    if (category.image.startsWith('http') || category.image.startsWith('assets/')) return category.image;
    if (this.localCategoryImages[category.image]) return this.localCategoryImages[category.image];
    return this.imageBaseUrl + category.image;
  }

  getProductImage(product: Product): string {
    const img = product.imageCover || (product.images && product.images[0]);
    if (!img) return 'assets/images/logo.png';
    if (img.startsWith('http') || img.startsWith('assets/')) return img;
    return this.imageBaseUrl + img;
  }

  onImgError(event: Event, fallbackPath: string = 'assets/images/logo.png'): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== fallbackPath) {
      target.src = fallbackPath;
    }
  }

  hasDiscount(product: Product): boolean {
    const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
    return !!discount && discount < product.price;
  }

  getFinalPrice(product: Product): number {
    return product.priceAfterDiscount ?? product.priceAfterdiscound ?? product.price;
  }

  isLimitedQuantity(product: Product): boolean {
    return typeof product.quantity === 'number' && product.quantity > 0 && product.quantity <= 10;
  }
}
