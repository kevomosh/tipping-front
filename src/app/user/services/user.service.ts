import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResultDTO} from '../../dto/resultDTO';
import {ParamService} from './param.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {ParamsDTO} from '../../dto/paramsDTO';
import {PickResultDTO} from '../../dto/PickResultDTO';
import {LoadingService} from '../../shared/services/loading.service';
import {GamesForWeekDTO} from '../../dto/gamesForWeekDTO';
import {MakePickView} from '../../views/makePickView';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient,
              private paramService: ParamService,
              private loadingService: LoadingService
              ) { }
  private baseUrl = environment.apiUrl;

  private static createParamsUrl(params: ParamsDTO, initial: string): string {
    const a = params.page ? `${initial}page=${params.page}` : initial;
    const b = params.size ? `${a}&size=${params.size}` : a;
    const c = params.gid ? `${b}&gid=${params.gid}` : b;
    return  params.name ? `${c}&name=${params.name}` : c;
  }

  private static createParamsUrlWithSort(initial: string, params: ParamsDTO): string {
    let d = this.createParamsUrl(params, initial);

    const sortParams = params.sort;
    if (sortParams && sortParams.length > 0) {
      for (const s of sortParams) {
        d = `${d}&sort=${s}`;
      }
    }
    return d;
  }

  createPick(comp: string, info: MakePickView): Observable<{ message: string }> {
    const url = `${this.baseUrl}/user/${comp}/createPick`;
    return this.http.post<{ message: string }>(url, info);
  }

  getGames(comp: string, weekNumber?: number): Observable<GamesForWeekDTO> {
    let url = `${this.baseUrl}/user/${comp}/getLatestGames`;
    if (weekNumber) {
      url = `${this.baseUrl}/user/${comp}/getGamesForWeek/${weekNumber}`;
    }
    return this.http.get<GamesForWeekDTO>(url);
  }

  getResults(comp: string): Observable<ResultDTO> {
    const initial = `${this.baseUrl}/user/${comp}/getResultsForWeek?`;
    return this.paramService.getMainParams().pipe(
      tap(() => this.loadingService.setTableLoading(true)),
      map(params => UserService.createParamsUrlWithSort(initial, params)),
      switchMap(url => this.http.get<ResultDTO>(url)),
      tap(() => this.loadingService.setTableLoading(false))
    );
  }

   getPicks(comp: string, weekNumber: number): Observable<PickResultDTO> {
    let url = `${this.baseUrl}/user/${comp}/getPicks?`;
    if (weekNumber) {
      url = `${this.baseUrl}/user/${comp}/getPicks/${weekNumber}?`;
    }
    return this.paramService.getMainParams().pipe(
      tap(() => this.loadingService.setTableLoading(true)),
      map(params => UserService.createParamsUrl(params, url)),
      switchMap(z => this.http.get<PickResultDTO>(z)),
      tap(() => this.loadingService.setTableLoading(false))
    );
   }

}
