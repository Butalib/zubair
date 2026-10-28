import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiResponse, Classification } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-classifications-section',
  templateUrl: './classifications-section.html',
  styleUrl: './classifications-section.scss',
  standalone: false
})
export class ClassificationsSectionComponent implements OnInit, OnDestroy {

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  private readonly localOfferImages: Record<string, string> = {
    'img-1759312346164.jpeg': 'assets/images/offers/img-1759312346164.jpeg',
    'img-1759312381259.jpeg': 'assets/images/offers/img-1759312381259.jpeg',
    'img-1759312425771.jpeg': 'assets/images/offers/img-1759312425771.jpeg',
    'img-1762250241948.jpeg': 'assets/images/offers/img-1762250241948.jpeg',
    'img-1763391903217.jpeg': 'assets/images/offers/img-1763391903217.jpeg'
  };

  private readonly MAX_ITEMS = 5;

  /** If true, delays data fetching until loadClassifications() is explicitly called */
  @Input() lazy = false;

  readonly classifications = signal<Classification[]>([]);
  readonly loading = signal<boolean>(true);
  readonly hasError = signal<boolean>(false);

  private subscription?: Subscription;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (!this.lazy) {
      this.loadClassifications();
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  loadClassifications(): void {
    this.subscription?.unsubscribe();
    this.loading.set(true);
    this.hasError.set(false);

    this.subscription = this.dataService.getData<ApiResponse<Classification[]>>('classification').subscribe({
      next: (res) => {
        if (res?.data && Array.isArray(res.data)) {
          const activeItems = res.data.filter(item => item.active !== false);
          this.classifications.set(activeItems.slice(0, this.MAX_ITEMS));
        } else {
          this.classifications.set([]);
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
    this.loadClassifications();
  }

  getClassificationImage(c: Classification): string {
    if (!c.image) return 'assets/images/logo.png';
    if (c.image.startsWith('http') || c.image.startsWith('assets/')) return c.image;
    if (this.localOfferImages[c.image]) return this.localOfferImages[c.image];
    return this.imageBaseUrl + c.image;
  }

  onImgError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target && target.src !== 'assets/images/logo.png') {
      target.src = 'assets/images/logo.png';
    }
  }
}
