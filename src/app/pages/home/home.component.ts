import { Component, OnInit } from '@angular/core';
import { OlympicService } from '../../core/services/olympic.service';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';
import { OlympicCountry } from '../../core/models/Olympic';
import { Participation } from '../../core/models/Participation';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  olympics: OlympicCountry[] = [];
  chart: any;
  totalJOs: number = 0;
  totalCountries: number = 0;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.olympicService.loadInitialData().subscribe(); // Charger les données
  
    this.olympicService.getOlympics().subscribe(data => {
      console.log('📡 Données après récupération:', data);
  
      if (data && data.length > 0) {  // Vérifie si un tableau non vide est reçu
        this.olympics = data;
        this.totalJOs = this.calculateTotalJOs();
        this.totalCountries = this.olympics.length;
        this.createPieChart();
      } else {
        console.warn('⚠ Aucune donnée reçue, assignation d’un tableau vide.');
        this.olympics = []; // Empêche l’erreur
      }
    });
  }
  
  

  // Fonction pour calculer le nombre total de JOs uniques
  calculateTotalJOs(): number {
    const years = this.olympics.flatMap((o: OlympicCountry) =>
      o.participations.map((p: Participation) => p.year)
    );
    return new Set(years).size; // Compter les années uniques
  }

  createPieChart(): void {
    const ctx = document.getElementById('medalPieChart') as HTMLCanvasElement;
  
    if (this.chart) { 
      this.chart.destroy(); // 🔥 Détruire l'ancien graphique avant d'en créer un nouveau
    }
  
    const labels = this.olympics.map((o: OlympicCountry) => o.country);
    const data = this.olympics.map((o: OlympicCountry) =>
      o.participations.reduce((sum: number, p: Participation) => sum + p.medalsCount, 0)
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
        layout: {
          padding: 20
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
