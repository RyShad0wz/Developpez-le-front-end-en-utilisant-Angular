import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { Chart, registerables } from 'chart.js';
import { OlympicCountry } from '../../core/models/Olympic';

Chart.register(...registerables);

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent implements OnInit {
  countryData: OlympicCountry = { id: 0, country: '', participations: [] };
  totalMedals: number = 0;
  chart: any;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));

    this.olympicService.getOlympics().subscribe((data) => {
      if (data) {
        const country = data.find((c) => c.id === countryId);
        if (country) {
          this.countryData = country;
          this.totalMedals = this.countryData.participations.reduce(
            (sum, p) => sum + (p.medalsCount || 0),
            0
          );
          this.createLineChart();
        }
      }
    });
  }

  createLineChart(): void {
    if (!this.countryData.participations.length) return;

    const ctx = document.getElementById('medalHistoryChart') as HTMLCanvasElement;
    const labels = this.countryData.participations.map((p) => p.year);
    const data = this.countryData.participations.map((p) => p.medalsCount || 0);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Médailles par année',
            data,
            borderColor: '#0085C7',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}
