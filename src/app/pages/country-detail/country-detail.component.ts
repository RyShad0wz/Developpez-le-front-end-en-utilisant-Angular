import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from '../../core/services/olympic.service';
import { OlympicCountry } from '../../core/models/Olympic';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.component.html',
  styleUrls: ['./country-detail.component.scss']
})
export class CountryDetailComponent implements OnInit {
  countryData: OlympicCountry | null = null;
  totalMedals: number = 0;
  totalAthletes: number = 0;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const countryId = Number(this.route.snapshot.paramMap.get('id'));

    this.olympicService.getOlympics().subscribe((data) => {
      if (data && Array.isArray(data)) {
        this.countryData = data.find((country) => country.id === countryId) || null;

        if (this.countryData?.participations) {
          this.totalMedals = this.countryData.participations.reduce(
            (sum, p) => sum + (p.medalsCount || 0),
            0
          );

          this.totalAthletes = this.countryData.participations.reduce(
            (sum, p) => sum + (p.athleteCount || 0),
            0
          );
        } else {
          this.router.navigate(['/404']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
