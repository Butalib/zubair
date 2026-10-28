import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ApiResponse, Brand, DisplayProduct, Product } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-brand-products-page',
  templateUrl: './brand-products-page.html',
  styleUrl: './brand-products-page.scss',
  standalone: false
})
export class BrandProductsPageComponent implements OnInit, OnDestroy {
  readonly brand = signal<Brand | null>(null);
  readonly products = signal<DisplayProduct[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);
  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';
  readonly sortOptions = [
    { value: '', label: 'الكل' },
    { value: '-createdAt', label: 'الأحدث' },
    { value: 'price', label: 'الأقل سعراً' },
    { value: '-price', label: 'الأعلى سعراً' },
    { value: '-sold', label: 'الأكثر طلباً' }
  ];

  private readonly subscriptions = new Subscription();
  private readonly searchSubject = new Subject<string>();
  private brandId = '';
  searchTerm = '';
  selectedSort = '';

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.searchSubject
        .pipe(debounceTime(350), distinctUntilChanged())
        .subscribe(term => {
          this.searchTerm = term;
          this.loadProducts(this.brandId);
        })
    );

    this.subscriptions.add(
      this.route.params.subscribe(params => {
        const id = params['id'];
        if (id) {
          this.brandId = id;
          this.loadData(id);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadData(id: string): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.subscriptions.add(
      this.dataService.getData<ApiResponse<Brand[]>>('brands', 8000).subscribe({
        next: response => {
          const selectedBrand = response?.data?.find(item => item._id === id) ?? null;
          this.brand.set(selectedBrand);
          this.loadProducts(id);
        },
        error: () => {
          this.brand.set(null);
          this.loadProducts(id);
        }
      })
    );
  }

  private loadProducts(id: string): void {
    let query = `products?brand=${encodeURIComponent(id)}&limit=50`;
    if (this.searchTerm) {
      query += `&keyword=${encodeURIComponent(this.searchTerm)}`;
    }
    if (this.selectedSort) {
      query += `&sort=${this.selectedSort}`;
    }

    this.subscriptions.add(
      this.dataService.getData<ApiResponse<Product[]>>(query, 8000).subscribe({
        next: response => {
          this.products.set((response?.data || []).map(product => this.toDisplayProduct(product)));
          this.isLoading.set(false);
        },
        error: () => {
          this.products.set([]);
          this.hasError.set(true);
          this.isLoading.set(false);
        }
      })
    );
  }

  private toDisplayProduct(product: Product): DisplayProduct {
    const discount = product.priceAfterDiscount ?? product.priceAfterdiscound;
    const hasDiscount = !!discount && discount < product.price;
    const image = product.imageCover || product.images?.[0];

    return {
      ...product,
      imageUrl: image
        ? (image.startsWith('http') || image.startsWith('assets/') ? image : this.imageBaseUrl + image)
        : 'assets/images/logo.png',
      hasDiscount,
      finalPrice: hasDiscount ? discount : product.price,
      isLimited: product.quantity !== undefined && product.quantity <= 5,
      isWishlisted: false
    };
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value.trim());
  }

  onSortChange(sortValue: string): void {
    this.selectedSort = sortValue;
    this.loadProducts(this.brandId);
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/logo.png';
  }
}
