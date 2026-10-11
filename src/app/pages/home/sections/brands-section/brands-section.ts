import { Component, OnInit, signal } from '@angular/core';
import { Brand } from 'src/app/core/interfaces/project-interfaces';
import { DataService } from 'src/app/core/services/data/data.service';

@Component({
  selector: 'app-brands-section',
  templateUrl: './brands-section.html',
  styleUrl: './brands-section.scss',
  standalone: false
})
export class BrandsSectionComponent implements OnInit {

  readonly brands = signal<Brand[]>([
    { _id: '1', name: 'L\'Oréal' },
    { _id: '2', name: 'CeraVe' },
    { _id: '3', name: 'La Roche-Posay' },
    { _id: '4', name: 'COSRX' },
    { _id: '5', name: 'The Ordinary' },
    { _id: '6', name: 'Bioderma' },
    { _id: '7', name: 'Vichy' },
    { _id: '8', name: 'Beauty of Joseon' },
  ]);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData('brands').subscribe({
      next: (res: any) => {
        if (res?.data && res.data.length > 0) {
          this.brands.set(res.data);
        }
      },
      error: () => { /* keep local fallback brands */ }
    });
  }
}
