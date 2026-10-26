import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  ApiResponse,
  Brand,
  Category,
  DisplayProduct,
  PaginationResult,
  Product,
  SortOption,
} from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.html',
  styleUrl: './products-page.scss',
  standalone: false,
})
export class ProductsPageComponent implements OnInit, OnDestroy {
  readonly products = signal<DisplayProduct[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly brands = signal<Brand[]>([]);
  readonly pagination = signal<PaginationResult | null>(null);
  readonly isLoading = signal(true);
  readonly isLoadingFilters = signal(true);
  readonly hasError = signal(false);

  readonly sortOptions: readonly SortOption[] = [
    { value: '', label: 'الكل' },
    { value: '-createdAt', label: 'الأحدث' },
    { value: 'price', label: 'الأقل سعراً' },
    { value: '-price', label: 'الأعلى سعراً' },
    { value: '-sold', label: 'الأكثر طلباً' },
  ];

  searchTerm = '';
  selectedSort = '';
  currentPage = 1;
  selectedCategoryIds: string[] = [];
  selectedBrandIds: string[] = [];
  filtersExpanded = false;

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  private readonly subscriptions = new Subscription();
  private readonly searchSubject = new Subject<string>();
  private productsSubscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchSubject.pipe(debounceTime(350), distinctUntilChanged()).subscribe((term) => {
        this.searchTerm = term;
        this.currentPage = 1;
        this.loadProducts();
      }),
    );

    this.loadFilters();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.productsSubscription?.unsubscribe();
  }

  private loadFilters(): void {
    this.isLoadingFilters.set(true);
    this.subscriptions.add(
      this.dataService.getData<ApiResponse<Category[]>>('categories', 8000).subscribe({
        next: (response) => this.categories.set(Array.isArray(response?.data) ? response.data : []),
        error: () => this.categories.set([]),
      }),
    );
    this.subscriptions.add(
      this.dataService.getData<ApiResponse<Brand[]>>('brands', 8000).subscribe({
        next: (response) => {
          this.brands.set(Array.isArray(response?.data) ? response.data : []);
          this.isLoadingFilters.set(false);
        },
        error: () => {
          this.brands.set([]);
          this.isLoadingFilters.set(false);
        },
      }),
    );
  }

  loadProducts(): void {
    this.productsSubscription?.unsubscribe();
    this.isLoading.set(true);
    this.hasError.set(false);

    const params = [`page=${this.currentPage}`, 'limit=12'];

    if (this.searchTerm) {
      params.push(`keyword=${encodeURIComponent(this.searchTerm)}`);
    }
    if (this.selectedSort) {
      params.push(`sort=${encodeURIComponent(this.selectedSort)}`);
    }
    this.selectedCategoryIds.forEach((id) => params.push(`category=${encodeURIComponent(id)}`));
    this.selectedBrandIds.forEach((id) => params.push(`brand=${encodeURIComponent(id)}`));

    this.productsSubscription = this.dataService
      .getData<ApiResponse<Product[]>>(`products?${params.join('&')}`, 8000)
      .subscribe({
        next: (response) => {
          this.products.set(
            (response?.data || []).map((product) => this.toDisplayProduct(product)),
          );
          this.pagination.set(response?.paginationResult ?? null);
          this.isLoading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.pagination.set(null);
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
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

  toggleCategory(categoryId: string): void {
    this.selectedCategoryIds = this.toggleSelection(this.selectedCategoryIds, categoryId);
    this.currentPage = 1;
    this.loadProducts();
  }

  toggleBrand(brandId: string): void {
    this.selectedBrandIds = this.toggleSelection(this.selectedBrandIds, brandId);
    this.currentPage = 1;
    this.loadProducts();
  }

  isCategorySelected(categoryId: string): boolean {
    return this.selectedCategoryIds.includes(categoryId);
  }

  isBrandSelected(brandId: string): boolean {
    return this.selectedBrandIds.includes(brandId);
  }

  clearFilters(): void {
    this.selectedCategoryIds = [];
    this.selectedBrandIds = [];
    this.selectedSort = '';
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadProducts();
  }

  retry(): void {
    this.loadFilters();
    this.loadProducts();
  }

  goToPage(page: number): void {
    const pagination = this.pagination();
    if (!pagination || page < 1 || page > pagination.numberOfPages) {
      return;
    }
    this.currentPage = page;
    this.loadProducts();
    document
      .getElementById('products-stage')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  get totalPages(): number {
    return this.pagination()?.numberOfPages ?? 0;
  }

  get pageNumbers(): number[] {
    const total = this.totalPages;
    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => index + 1);
    }

    const pages = [1];
    if (this.currentPage > 3) {
      pages.push(-1);
    }
    for (
      let page = Math.max(2, this.currentPage - 1);
      page <= Math.min(total - 1, this.currentPage + 1);
      page++
    ) {
      pages.push(page);
    }
    if (this.currentPage < total - 2) {
      pages.push(-1);
    }
    pages.push(total);
    return pages;
  }

  toggleWishlist(product: DisplayProduct, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    product.isWishlisted = !product.isWishlisted;
    this.products.set([...this.products()]);
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('is-added');
    setTimeout(() => target.classList.remove('is-added'), 700);
  }

  getDiscountPercent(product: DisplayProduct): number {
    if (!product.hasDiscount || !product.price) {
      return 0;
    }
    return Math.round(((product.price - product.finalPrice) / product.price) * 100);
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target.src !== 'assets/images/logo.png') {
      target.src = 'assets/images/logo.png';
    }
  }

  trackById(_index: number, product: DisplayProduct): string {
    return product._id;
  }

  private toggleSelection(current: string[], id: string): string[] {
    return current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
  }

  private toDisplayProduct(product: Product): DisplayProduct {
    const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
    const hasDiscount = !!discount && discount < product.price;
    const image = product.imageCover || product.images?.[0];

    return {
      ...product,
      imageUrl: image
        ? image.startsWith('http') || image.startsWith('assets/')
          ? image
          : this.imageBaseUrl + image
        : 'assets/images/logo.png',
      isWishlisted: false,
      isLimited:
        typeof product.quantity === 'number' && product.quantity > 0 && product.quantity <= 10,
      hasDiscount,
      finalPrice: hasDiscount ? discount : product.price,
    };
  }
}
