import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Generic & Dynamic InView Directive
 *
 * Uses IntersectionObserver to detect when an element enters or leaves the viewport.
 * Fully compatible with SSR (Angular Universal) and older browsers.
 *
 * Usage examples:
 * 1. Simple Lazy Loading (triggers once with 200px margin):
 *    <div appInView (inView)="loadData()"></div>
 *
 * 2. Aliased shorthand:
 *    <div (appInView)="loadData()"></div>
 *
 * 3. Custom prefetch distance:
 *    <div appInView [rootMargin]="'300px'" (inView)="loadData()"></div>
 *
 * 4. Toggle on enter/leave for scroll animations:
 *    <div appInView [once]="false" (inView)="isVisible = $event"></div>
 */
@Directive({
  selector: '[appInView]',
  standalone: true
})
export class InViewDirective implements OnInit, OnDestroy {
  /**
   * Distance margin before the element enters the viewport.
   * Default is '200px' (triggers 200px before scrolling into view for a smooth feel).
   */
  @Input() rootMargin = '200px';

  /**
   * Percentage of visibility required (0 to 1).
   * 0 = triggers as soon as the first pixel (or margin) touches viewport.
   * 0.5 = triggers when 50% of the element is visible.
   */
  @Input() threshold: number | number[] = 0;

  /**
   * If true: stops observing and disconnects after the first time it enters view (perfect for lazy loading data).
   * If false: continuously emits true when entering and false when leaving (perfect for animations/spy).
   */
  @Input() once = true;

  /**
   * If true: bypasses the observer and emits immediately (useful to conditionally disable lazy loading).
   */
  @Input() disabled = false;

  /**
   * Main output event emitting true when entering view (and false on exit if once is false).
   */
  @Output() inView = new EventEmitter<boolean>();

  /**
   * Alias output allowing syntax: (appInView)="loadData()"
   */
  @Output('appInView') appInView = this.inView;

  /**
   * Detailed output emitting the raw IntersectionObserverEntry if needed (coordinates, ratio, etc.).
   */
  @Output() entryChange = new EventEmitter<IntersectionObserverEntry>();

  private observer?: IntersectionObserver;
  private hasTriggered = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    // 1. SSR Guard: IntersectionObserver is a browser API; skip on Node.js server
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // 2. If disabled (e.g. above the fold or on demand), trigger immediately
    if (this.disabled) {
      this.inView.emit(true);
      return;
    }

    this.startObserving();
  }

  private startObserving(): void {
    // 3. Fallback for environments lacking IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      this.inView.emit(true);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          this.entryChange.emit(entry);

          if (entry.isIntersecting) {
            this.hasTriggered = true;
            this.inView.emit(true);

            if (this.once) {
              this.disconnect();
            }
          } else if (!this.once && this.hasTriggered) {
            this.inView.emit(false);
          }
        });
      },
      {
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private disconnect(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
