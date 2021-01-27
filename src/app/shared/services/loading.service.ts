import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }
  // tslint:disable-next-line:variable-name
  private _tableLoading = new BehaviorSubject(false);
  // tslint:disable-next-line:variable-name
  private _loading$ = new BehaviorSubject(false);

  setLoading(val: boolean): void {
    this._loading$.next(val);
  }

  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  setTableLoading(val: boolean): void {
    this._tableLoading.next(val);
  }

  get tableIsLoading(): Observable<boolean> {
    return this._tableLoading.asObservable();
  }
}
