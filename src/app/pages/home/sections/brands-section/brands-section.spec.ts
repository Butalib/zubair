import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { BrandsSectionComponent } from './brands-section';
import { DataService } from 'src/app/core/services/data/data.service';
import { Brand } from 'src/app/core/interfaces/project-interfaces';

describe('BrandsSectionComponent', () => {
  let component: BrandsSectionComponent;
  let fixture: ComponentFixture<BrandsSectionComponent>;
  let dataServiceMock: { getData: ReturnType<typeof vi.fn> };

  const mockBrands: Brand[] = [
    { _id: 'b1', name: 'Brand One' },
    { _id: 'b2', name: 'Brand Two' }
  ];

  beforeEach(async () => {
    dataServiceMock = {
      getData: vi.fn().mockReturnValue(of({ data: mockBrands }))
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [BrandsSectionComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock }
      ]
    }).compileComponents();
  });

  it('should initialize with loading state before response arrives', () => {
    const subject = new Subject<any>();
    dataServiceMock.getData.mockReturnValue(subject.asObservable());

    fixture = TestBed.createComponent(BrandsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    expect(component.hasError()).toBe(false);
    expect(component.brands()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brands-strip--skeleton')).toBeTruthy();
  });

  it('should render genuine server brands and terminate loading on success', () => {
    fixture = TestBed.createComponent(BrandsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.brands()).toEqual(mockBrands);

    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.brands-strip__item');
    expect(items.length).toBe(2);
    expect(items[0].textContent?.trim()).toBe('Brand One');
    expect(items[0].getAttribute('href')).toBe('/brands/b1');
  });

  it('should handle empty API response gracefully and not render fake brands', () => {
    dataServiceMock.getData.mockReturnValue(of({ data: [] }));

    fixture = TestBed.createComponent(BrandsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.brands()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__empty')).toBeTruthy();
    expect(compiled.querySelectorAll('.brands-strip__item').length).toBe(0);
  });

  it('should handle API failure with error state and retry successfully', () => {
    dataServiceMock.getData.mockReturnValue(throwError(() => new Error('Network error')));

    fixture = TestBed.createComponent(BrandsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(true);
    expect(component.brands()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__retry-btn')).toBeTruthy();

    // Now test retry recovery
    dataServiceMock.getData.mockReturnValue(of({ data: mockBrands }));
    component.retry();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.brands()).toEqual(mockBrands);
  });
});
