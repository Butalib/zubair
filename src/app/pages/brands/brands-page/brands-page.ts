import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse, Brand } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-brands-page',
  templateUrl: './brands-page.html',
  styleUrl: './brands-page.scss',
  standalone: false
})
export class BrandsPageComponent implements OnInit, OnDestroy {
  readonly brands = signal<Brand[]>([]);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  private subscription?: Subscription;
  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadBrands();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadBrands(): void {
    this.subscription?.unsubscribe();
    this.isLoading.set(true);
    this.hasError.set(false);

    this.subscription = this.dataService.getData<ApiResponse<Brand[]>>('brands', 8000).subscribe({
      next: (response) => {
        this.brands.set(Array.isArray(response?.data) ? response.data : []);
        this.isLoading.set(false);
      },
      error: () => {
        this.brands.set([]);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  retry(): void {
    this.loadBrands();
  }

  getBrandImage(brand: Brand): string {
    if (!brand.image) {
      return 'assets/images/logo.png';
    }

    if (brand.image.startsWith('http') || brand.image.startsWith('assets/')) {
      return brand.image;
    }

    return this.imageBaseUrl + brand.image;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = 'assets/images/logo.png';
  }
}
