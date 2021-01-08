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

  getResults(comp: string): Observable<ResultDTO> {
    const initial = `${this.baseUrl}/${comp}/user/getResultsForWeek?`;
    return this.paramService.getMainParams().pipe(
      tap(() => this.loadingService.setTableLoading(true)),
      map(params => UserService.createParamsUrlWithSort(initial, params)),
      switchMap(url => this.http.get<ResultDTO>(url)),
      tap(() => this.loadingService.setTableLoading(false))
    );
  }

   getPicks(comp: string, weekNumber: number): Observable<PickResultDTO> {
    let url = `${this.baseUrl}/${comp}/user/getPicks?`;
    if (weekNumber) {
      url = `${this.baseUrl}/${comp}/user/getPicks/${weekNumber}?`;
    }
    return this.paramService.getMainParams().pipe(
      tap(() => this.loadingService.setTableLoading(true)),
      map(params => UserService.createParamsUrl(params, url)),
      switchMap(z => this.http.get<PickResultDTO>(z)),
      tap(() => this.loadingService.setTableLoading(false))
    );
   }

}
