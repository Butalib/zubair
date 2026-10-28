import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of, throwError, Subject } from 'rxjs';
import { ClassificationsSectionComponent } from './classifications-section';
import { DataService } from 'src/app/core/services/data/data.service';
import { Classification } from 'src/app/core/interfaces/project-interfaces';

describe('ClassificationsSectionComponent', () => {
  let component: ClassificationsSectionComponent;
  let fixture: ComponentFixture<ClassificationsSectionComponent>;
  let dataServiceMock: { getData: ReturnType<typeof vi.fn> };

  const mockClassifications: Classification[] = [
    { _id: 'c1', name: 'Problem A', image: 'img-1.jpg', active: true },
    { _id: 'c2', name: 'Problem B', image: 'img-2.jpg', active: true },
    { _id: 'c3', name: 'Problem C', image: 'img-3.jpg', active: true },
    { _id: 'c4', name: 'Problem D', image: 'img-4.jpg', active: true },
    { _id: 'c5', name: 'Problem E', image: 'img-5.jpg', active: true },
    { _id: 'c6', name: 'Problem F', image: 'img-6.jpg', active: true }
  ];

  beforeEach(async () => {
    dataServiceMock = {
      getData: vi.fn().mockReturnValue(of({ data: mockClassifications }))
    };

    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [ClassificationsSectionComponent],
      providers: [
        { provide: DataService, useValue: dataServiceMock }
      ]
    }).compileComponents();
  });

  it('should initialize with loading state before response arrives', () => {
    const subject = new Subject<any>();
    dataServiceMock.getData.mockReturnValue(subject.asObservable());

    fixture = TestBed.createComponent(ClassificationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(true);
    expect(component.hasError()).toBe(false);
    expect(component.classifications()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelectorAll('.problem-card--skeleton').length).toBe(5);
  });

  it('should render genuine server classifications capped at 5 items', () => {
    fixture = TestBed.createComponent(ClassificationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.classifications().length).toBe(5);
    expect(component.classifications()[0]._id).toBe('c1');

    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.problem-card:not(.problem-card--skeleton)');
    expect(cards.length).toBe(5);
    expect(cards[0].getAttribute('href')).toBe('/shop/classification/c1');
    expect(cards[0].textContent).toContain('Problem A');
  });

  it('should handle empty API response gracefully', () => {
    dataServiceMock.getData.mockReturnValue(of({ data: [] }));

    fixture = TestBed.createComponent(ClassificationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.classifications()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__empty')).toBeTruthy();
  });

  it('should handle API failure with error state and retry successfully', () => {
    dataServiceMock.getData.mockReturnValue(throwError(() => new Error('Server error')));

    fixture = TestBed.createComponent(ClassificationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(true);
    expect(component.classifications()).toEqual([]);

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.home-section__retry-btn')).toBeTruthy();

    // Retry
    dataServiceMock.getData.mockReturnValue(of({ data: mockClassifications }));
    component.retry();
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
    expect(component.hasError()).toBe(false);
    expect(component.classifications().length).toBe(5);
  });
});
