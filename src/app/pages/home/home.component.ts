import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Router } from '@angular/router';
import { OlympicCountry } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  olympics: OlympicCountry[] = [];
  totalJOs: number = 0;
  totalCountries: number = 0;
  pieChartData: { name: string; value: number }[] = [];
  subscriptions: Subscription = new Subscription();

  // ✅ Taille du graphique dynamique
  view: [number, number] = [800, 500];

  // Options ngx-charts
  showLegend: boolean = false;
  showLabels: boolean = true;
  explodeSlices: boolean = false;
  doughnut: boolean = false;
  colorScheme: { domain: string[] } = { domain: [] };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptions.add(this.olympicService.loadInitialData().subscribe());
    this.subscriptions.add(
      this.olympicService.getOlympics().subscribe((data: OlympicCountry[] | null) => {
        if (data && data.length > 0) {
          this.olympics = data;
          this.totalJOs = this.calculateTotalJOs();
          this.totalCountries = this.olympics.length;
          this.preparePieChartData();
        } else {
          console.warn('⚠ Aucune donnée reçue.');
          this.olympics = [];
        }
      })
    );

    this.updateChartSize(); // Appel initial pour ajuster la taille
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private calculateTotalJOs(): number {
    const years: number[] = this.olympics.flatMap((o: OlympicCountry) =>
      o.participations.map((p: Participation) => p.year)
    );
    return new Set(years).size;
  }

  private preparePieChartData(): void {
    this.pieChartData = this.olympics.map((o: OlympicCountry) => ({
      name: o.country,
      value: o.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0)
    }));

    this.colorScheme = {
      domain: this.pieChartData.map(() => this.generateRandomColor())
    };
  }

  private generateRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  onSelect(data: { name: string; value: number }): void {
    console.log('Pays sélectionné:', data);
    const country: OlympicCountry | undefined = this.olympics.find(o => o.country === data.name);
    if (country) {
      this.router.navigate([`/country/${country.id}`]);
    }
  }

  // ✅ Mise à jour de la taille du graphique en fonction de la taille de l'écran
  @HostListener('window:resize', [])
  updateChartSize(): void {
    const width = window.innerWidth;
    if (width > 1200) {
      this.view = [700, 500]; // Taille grand écran
    } else if (width > 768) {
      this.view = [500, 400]; // Tablette
    } else {
      this.view = [500, 400]; // Mobile
    }
  }
}
