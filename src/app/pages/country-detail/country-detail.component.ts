import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { OlympicCountry } from '../../core/models/Olympic';
import { OlympicService } from '../../core/services/olympic.service';
import { Participation } from '../../core/models/Participation';

Chart.register(...registerables);

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit, AfterViewInit {
  countryData!: OlympicCountry | null;
  totalMedals: number = 0;
  totalAthletes: number = 0;
  chart!: Chart;

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

          // On attend AfterViewInit pour s'assurer que le canvas est bien présent
          setTimeout(() => {
            this.createLineChart();
          }, 100);
        }
      }
    });
  }

  ngAfterViewInit(): void {
    // Sécurité supplémentaire au cas où le canvas ne serait pas encore disponible
    setTimeout(() => {
      if (this.countryData) {
        this.createLineChart();
      }
    }, 300);
  }

  createLineChart(): void {
    if (!this.countryData) return;

    const ctx = document.getElementById('medalHistoryChart') as HTMLCanvasElement;
    
    if (!ctx) {
      console.error("❌ Canvas 'medalHistoryChart' introuvable !");
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    const labels = this.countryData.participations.map((p: Participation) => p.year);
    const data = this.countryData.participations.map((p: Participation) => p.medalsCount);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Médailles par année',
            data,
            borderColor: '#0085C7',
            backgroundColor: 'rgba(0, 133, 199, 0.2)',
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: '#0085C7'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => `${tooltipItem.raw} médailles`
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Années'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Médailles'
            },
            beginAtZero: true
          }
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
