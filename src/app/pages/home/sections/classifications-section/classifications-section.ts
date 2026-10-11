import { Component, OnInit, signal } from '@angular/core';
import { Classification } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-classifications-section',
  templateUrl: './classifications-section.html',
  styleUrl: './classifications-section.scss',
  standalone: false
})
export class ClassificationsSectionComponent implements OnInit {

  readonly imageBaseUrl = 'https://zoubair.md-iraqsoft.com/images/';

  private readonly localOfferImages: Record<string, string> = {
    'img-1759312346164.jpeg': 'assets/images/offers/img-1759312346164.jpeg',
    'img-1759312381259.jpeg': 'assets/images/offers/img-1759312381259.jpeg',
    'img-1759312425771.jpeg': 'assets/images/offers/img-1759312425771.jpeg',
    'img-1762250241948.jpeg': 'assets/images/offers/img-1762250241948.jpeg',
    'img-1763391903217.jpeg': 'assets/images/offers/img-1763391903217.jpeg'
  };

  // Pre-populated with local assets → shows instantly before HTTP response
  classifications: Classification[] = [
    { _id: '691afb814bd60a91502c06cf', name: 'مكملات صحية',         image: 'assets/images/offers/img-1763391903217.jpeg', active: true },
    { _id: '6909ce046d907a82838b4338', name: 'مكياج واكسسوارات',    image: 'assets/images/offers/img-1762250241948.jpeg', active: true },
    { _id: '68dcfa2c8ef01edc46f428dc', name: 'تسوقي حسب المادة',    image: 'assets/images/offers/img-1759312425771.jpeg', active: true },
    { _id: '68dcfa088ef01edc46f428ca', name: 'مشاكل الشعر',          image: 'assets/images/offers/img-1759312381259.jpeg', active: true },
    { _id: '68dcf9a98ef01edc46f428b1', name: 'مشاكل البشرة والجسم', image: 'assets/images/offers/img-1759312346164.jpeg', active: true }
  ];

  loading = false; // false because we already have local data

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // Sync only backend _id values; keep local images
    this.dataService.getData('classification').subscribe({
      next: (res: any) => {
        if (res?.data && Array.isArray(res.data)) {
          this.classifications = this.classifications.map(local => {
            const remote = res.data.find((c: any) => c.name?.trim() === local.name?.trim());
            return remote ? { ...local, _id: remote._id } : local;
          });
        }
      },
      error: () => { /* silently keep local data */ }
    });
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
