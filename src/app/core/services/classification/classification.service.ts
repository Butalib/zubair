import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap, shareReplay, catchError, map } from 'rxjs';
import { ApiResponse, Classification } from '../../interfaces/project-interfaces';
import { DataService } from '../data/data.service';

// ─── Known Slugs Dictionary (للـ Fallback والدعم الخلفي) ───────────────────────
export const KNOWN_CLASSIFICATION_SLUGS: Record<string, string> = {
  'health-supplements': 'مكملات صحية',
  'makeup-accessories': 'مكياج واكسسوارات',
  'shop-by-ingredient': 'تسوقي حسب المادة',
  'hair-problems': 'مشاكل الشعر',
  'skin-body-problems': 'مشاكل البشرة والجسم'
};

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  private dataService = inject(DataService);

  readonly classifications = signal<Classification[]>([]);
  readonly isLoading = signal<boolean>(false);

  private cache$: Observable<Classification[]> | null = null;

  /**
   * جلب التصنيفات مع Caching عبر shareReplay(1)
   * يضمن إجراء HTTP request واحد فقط مهما تعددت المكونات المستدعية
   */
  getClassifications(): Observable<Classification[]> {
    if (this.classifications().length > 0) {
      return of(this.classifications());
    }

    if (!this.cache$) {
      this.isLoading.set(true);
      this.cache$ = this.dataService
        .getData<ApiResponse<Classification[]>>('classification', 10000)
        .pipe(
          map(res => {
            const list = res?.data && Array.isArray(res.data)
              ? res.data.filter(c => c.active !== false)
              : [];
            this.classifications.set(list);
            this.isLoading.set(false);
            return list;
          }),
          catchError(err => {
            console.error('Failed to load classifications', err);
            this.isLoading.set(false);
            this.cache$ = null; // السماح بإعادة المحاولة عند الخطأ
            return of([]);
          }),
          shareReplay(1)
        );
    }

    return this.cache$;
  }

  /**
   * البحث عن تصنيف بالـ ID أو الـ Slug أو الاسم
   */
  findClassification(idOrSlug: string, list: Classification[]): Classification | undefined {
    if (!idOrSlug) return undefined;

    // 1. بحث بالـ _id المباشر
    const byId = list.find(c => c._id === idOrSlug);
    if (byId) return byId;

    // 2. فحص لو هو slug معروف
    const mappedName = KNOWN_CLASSIFICATION_SLUGS[idOrSlug.toLowerCase()];
    if (mappedName) {
      const byMappedName = list.find(c => c.name.trim().includes(mappedName) || mappedName.includes(c.name.trim()));
      if (byMappedName) return byMappedName;
    }

    // 3. بحث باسم التصنيف الجزئي أو المطابق
    const normalizedQuery = idOrSlug.trim().toLowerCase();
    return list.find(c => c.name.toLowerCase().includes(normalizedQuery));
  }
}
