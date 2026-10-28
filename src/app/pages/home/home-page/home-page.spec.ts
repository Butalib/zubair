import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { HomePageComponent } from './home-page';
import { DataService } from 'src/app/core/services/data/data.service';
import { Category } from 'src/app/core/interfaces/project-interfaces';

describe('HomePageComponent - Categories Section', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let dataServiceMock: { getData: ReturnType<typeof vi.fn> };

  const mockCategories: Category[] = [
    { _id: 'cat1', name: 'Category 1', image: 'img-1.jpg' },
    { _id: 'cat2', name: 'Category 2', image: 'img-2.jpg' },
    { _id: 'cat3', name: 'Category 3', image: 'img-3.jpg' },
    { _id: 'cat4', name: 'Category 4', image: 'img-4.jpg' },
    { _id: 'cat5', name: 'Category 5', image: 'img-5.jpg' },
    { _id: 'cat6', name: 'Category 6', image: 'img-6.jpg' }
  ];

  beforeEach(async () => {
    dataServiceMock = {
      getData: vi.fn().mockReturnValue(of({ data: mockCategories }))
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), FormsModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should initialize with loading state before categories arrive', () => {
    const subject = new Subject<any>();
    dataServiceMock.getData.mockReturnValue(subject.asObservable());

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadingCategories()).toBe(true);
    expect(component.categoriesError()).toBe(false);
    expect(component.categories()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.category-mosaic[aria-busy="true"]')).toBeTruthy();
  });

  it('should render genuine server categories capped at 5 items', () => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadingCategories()).toBe(false);
    expect(component.categoriesError()).toBe(false);
    expect(component.categories().length).toBe(5);
    expect(component.categories()[0]._id).toBe('cat1');

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.category-mosaic__card');
    expect(cards.length).toBe(5);
    expect(cards[0].getAttribute('href')).toBe('/categories?category=cat1');
    expect(cards[0].textContent).toContain('Category 1');
  });

  it('should handle empty categories response gracefully', () => {
    dataServiceMock.getData.mockReturnValue(of({ data: [] }));

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadingCategories()).toBe(false);
    expect(component.categoriesError()).toBe(false);
    expect(component.categories()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__empty')?.textContent).toContain('لا توجد أقسام متاحة حالياً');
  });

  it('should handle categories API failure with error state and retry successfully', () => {
    dataServiceMock.getData.mockReturnValue(throwError(() => new Error('Server error')));

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loadingCategories()).toBe(false);
    expect(component.categoriesError()).toBe(true);
    expect(component.categories()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__retry-btn')).toBeTruthy();

    // Retry
    dataServiceMock.getData.mockReturnValue(of({ data: mockCategories }));
    component.retryCategories();
    fixture.detectChanges();

    expect(component.loadingCategories()).toBe(false);
    expect(component.categoriesError()).toBe(false);
    expect(component.categories().length).toBe(5);
  });
});
