import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {GameDTO} from '../../dto/gameDTO';
import {HttpClient} from '@angular/common/http';
import {GamesForWeekDTO} from '../../dto/gamesForWeekDTO';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }
  private baseUrl = environment.apiUrl;

  getGamesToUpdate(comp: string): Observable<GamesForWeekDTO> {
    const url = `${this.baseUrl}/admin/${comp}/gamesToUpdate`;
    return this.http.get<GamesForWeekDTO>(url);
  }

  getAllTeams(comp: string): Observable<{weekNumber: number, teamNames: string[]}> {
    const url = `${this.baseUrl}/admin/${comp}/getAllTeams`;
    return this.http.get<{weekNumber: number, teamNames: string[]}>(url);
  }

  createWeek(comp: string, info: any): Observable<{ message: string }> {
    const url = `${this.baseUrl}/admin/${comp}/createWeek`;
    return this.http.post<{ message: string }>(url, info);
  }

  addResults(comp: string, info: any): Observable<{ message: string }> {
    const url = `${this.baseUrl}/admin/${comp}/addResults`;
    return this.http.post<{ message: string }>(url, info);
  }

  updateTotalScore(comp: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/admin/${comp}/updateTotalScore`;
    return this.http.put<{ message: string }>(url, {});
  }
}
