import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse, Brand } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-brands-section',
  templateUrl: './brands-section.html',
  styleUrl: './brands-section.scss',
  standalone: false
})
export class BrandsSectionComponent implements OnInit, OnDestroy {

  /** If true, delays data fetching until loadBrands() is explicitly called */
  @Input() lazy = false;

  readonly brands = signal<Brand[]>([]);
  readonly loading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (!this.lazy) {
      this.loadBrands();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadBrands(): void {
    this.subscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.subscription = this.dataService.getData<ApiResponse<Brand[]>>('brands').subscribe({
      next: (res) => {
        if (res?.data && Array.isArray(res.data)) {
          this.brands.set(res.data);
        } else {
          this.brands.set([]);
        }
        this.hasError.set(false);
        this.loading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.loading.set(false);
      }
    });
  }

  retry(): void {
    this.loadBrands();
  }
}
