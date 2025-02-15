import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Router } from '@angular/router';
import { OlympicCountry } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  olympics: OlympicCountry[] = [];
  totalJOs: number = 0;
  totalCountries: number = 0;
  pieChartData: any[] = [];
  view: [number, number] = [700, 500]; // ✅ Taille du graphique

  // Options ngx-charts
  showLegend: boolean = false;
  showLabels: boolean = true;
  explodeSlices: boolean = false;
  doughnut: boolean = false;

  colorScheme = {
    domain: ['#0085C7', '#F4C300', '#009F3D', '#DF0024', '#000000']
  };

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe();

    this.olympicService.getOlympics().subscribe(data => {
      if (data && data.length > 0) {
        this.olympics = data;
        this.totalJOs = this.calculateTotalJOs();
        this.totalCountries = this.olympics.length;
        this.preparePieChartData();
      } else {
        console.warn('⚠ Aucune donnée reçue.');
        this.olympics = [];
      }
    });
  }

  // Calcul du nombre de JOs uniques
  calculateTotalJOs(): number {
    const years = this.olympics.flatMap((o: OlympicCountry) =>
      o.participations.map((p: Participation) => p.year)
    );
    return new Set(years).size;
  }

  // Préparer les données pour ngx-charts
  preparePieChartData(): void {
    this.pieChartData = this.olympics.map((o: OlympicCountry) => ({
      name: o.country,
      value: o.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0)
    }));
  }

  // Gestion du clic sur un élément du Pie Chart
  onSelect(data: any): void {
    console.log('Pays sélectionné:', data);
    const country = this.olympics.find(o => o.country === data.name);
    if (country) {
      this.router.navigate([`/country/${country.id}`]);
    }
  }
}
