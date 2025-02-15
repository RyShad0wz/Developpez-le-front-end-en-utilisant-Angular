import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  countryData!: OlympicCountry | null;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  // Données pour ngx-charts
  lineChartData: any[] = [];
  view: [number, number] = [600, 400]; 

  // Options ngx-charts
  showLegend = true;
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
    const countryId = Number(this.route.snapshot.paramMap.get('id'));

    this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        this.countryData = data.find((c) => c.id === countryId) || null;

        if (this.countryData) {
          this.totalMedals = this.countryData.participations.reduce(
            (sum, p) => sum + p.medalsCount,
            0
          );
          this.totalAthletes = this.countryData.participations.reduce(
            (sum, p) => sum + p.athleteCount,
            0
          );

          this.prepareLineChartData();
        }
      }
    });
  }

  // Prépare les données pour ngx-charts
  prepareLineChartData(): void {
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

  goBack(): void {
    this.router.navigate(['/']);
  }
}
