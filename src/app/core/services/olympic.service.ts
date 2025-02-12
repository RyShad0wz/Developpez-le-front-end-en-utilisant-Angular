import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  // Utilisation du fichier JSON local
  private jsonDataUrl = '/assets/data/olympics.json'; 
  
  // API utilisable vers les données des JO 2024
  // private apiUrl = 'https://data.education.gouv.fr/api/explore/v2.1/catalog/datasets/paris-2024-results-medals-oly-eng/records?limit=20';

  private olympics$ = new BehaviorSubject<any[] | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données des JO (depuis un fichier JSON)
   */
  loadInitialData(): Observable<any[]> {
    return this.http.get<any[]>(this.jsonDataUrl).pipe(
      tap((data) => {
        console.log('✅ Données chargées depuis le JSON:', data);
        this.olympics$.next(data);
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération des données:', error);
        this.olympics$.next(null);
        return EMPTY;
      })
    );
  }

  /**
   * Méthode alternative pour récupérer les données via une API
   */
  /*
  loadInitialDataFromAPI(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap((data) => {
        console.log('📡 Données chargées depuis l’API:', data);
        this.olympics$.next(data);
      }),
      catchError((error) => {
        console.error('❌ Erreur lors de la récupération des données:', error);
        this.olympics$.next(null);
        return EMPTY;
      })
    );
  }
  */

  /**
   * Récupère les données des JO sous forme d'observable
   */
  getOlympics(): Observable<any[] | null> {
    return this.olympics$.asObservable();
  }
}
