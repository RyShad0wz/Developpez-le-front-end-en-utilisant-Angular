import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, OnDestroy {
  countryData!: OlympicCountry | null;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  subscriptions: Subscription = new Subscription(); // Gestion des abonnements

  // Données pour ngx-charts
  lineChartData: { name: string; series: { name: string; value: number }[] }[] = [];
  view: [number, number] = [window.innerWidth > 768 ? 700 : 350, 400];

  // Options ngx-charts
  showLegend = false;
  showLabels = true;
  showXAxis = true;
  showYAxis = true;
  colorScheme = {
    domain: ['#0085C7']
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    window.addEventListener('resize', this.updateViewSize);
    const countryId: number = Number(this.route.snapshot.paramMap.get('id'));

    this.subscriptions.add(
      this.olympicService.getOlympics().subscribe((data: OlympicCountry[] | null) => {
        if (data) {
          this.countryData = data.find((c: OlympicCountry) => c.id === countryId) || null;

          if (this.countryData) {
            this.totalMedals = this.calculateTotalMedals();
            this.totalAthletes = this.calculateTotalAthletes();
            this.prepareLineChartData();
          }
        }
      })
    );
  }

  // Se désabonner proprement pour éviter les fuites mémoire
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateViewSize);
    this.subscriptions.unsubscribe();
  }

  // Calcule le nombre total de médailles
  private calculateTotalMedals(): number {
    return this.countryData?.participations.reduce(
      (sum: number, p: Participation) => sum + p.medalsCount,
      0
    ) ?? 0;
  }

  // Calcule le nombre total d'athlètes
  private calculateTotalAthletes(): number {
    return this.countryData?.participations.reduce(
      (sum: number, p: Participation) => sum + p.athleteCount,
      0
    ) ?? 0;
  }

  // Prépare les données pour ngx-charts
  private prepareLineChartData(): void {
    if (!this.countryData) return;

    this.lineChartData = [
      {
        name: this.countryData.country,
        series: this.countryData.participations.map((p: Participation) => ({
          name: p.year.toString(),
          value: p.medalsCount
        }))
      }
    ];
  }

  updateViewSize = () => {
    this.view = [window.innerWidth > 768 ? 700 : 350, 400];
  };
  
  goBack(): void {
    this.router.navigate(['/']);
  }
  
}
