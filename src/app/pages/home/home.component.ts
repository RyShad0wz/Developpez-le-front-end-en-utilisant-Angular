import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Chart, registerables } from 'chart.js';
import { Router } from '@angular/router';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  olympics: any[] = [];
  chart: any;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.getOlympics().subscribe(data => {
      if (data && Array.isArray(data)) {
        this.olympics = data;
        console.log(' Données après correction:', this.olympics);
        this.createPieChart();
      } else {
        console.error(' Données reçues ne sont pas un tableau :', data);
        this.olympics = [];
      }
    });
  }

  createPieChart(): void {
    if (this.chart) {
      this.chart.destroy(); 
    }

    const ctx = document.getElementById('medalPieChart') as HTMLCanvasElement;
    if (!ctx) return;

    const labels = this.olympics.map(o => o.country);
    const data = this.olympics.map(o =>
      o.participations.reduce((sum: number, p: any) => sum + p.medalsCount, 0)
    );

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Nombre total de médailles',
            data,
            backgroundColor: ['#0085C7', '#F4C300', '#009F3D', '#DF0024', '#000000'],
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (tooltipItem: any) {
                return `${labels[tooltipItem.dataIndex]} : ${data[tooltipItem.dataIndex]} médailles`;
              }
            }
          }
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const countryId = this.olympics[index].id;
            this.router.navigate([`/country/${countryId}`]);
          }
        }
      }
    });
  }
}
