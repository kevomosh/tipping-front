import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ParamsDTO} from '../../dto/paramsDTO';

@Injectable({
  providedIn: 'root'
})
export class ParamService {

  constructor() { }


private mainParams$ = new BehaviorSubject<ParamsDTO>({});

  resetParams(): void {
    this.mainParams$.next({});
  }

  initializePagination(pageNumber: number, size: number): void {
    const val = { ...this.mainParams$.getValue()};
    if (Object.keys(val).length > 0) {
        val.size = size;
        val.page = pageNumber;
        this.mainParams$.next(val);

    } else {
      this.mainParams$.next({page: pageNumber, size});
    }
  }

  resetPageNumber(): void {
    const val = { ...this.mainParams$.getValue()};
    if (Object.keys(val).length > 0) {
      val.page = 0;
      this.mainParams$.next(val);
    } else {
      this.mainParams$.next({page: 0});
    }
  }

  setName(name: string): void {
    const val = { ...this.mainParams$.getValue()};
    if (name.length > 2) {
      if (Object.keys(val).length > 0) {
        val.name = name;
        val.page = 0;
        // val.sort = null;
        this.mainParams$.next(val);
      } else {
        this.mainParams$.next({page: 0, name});
      }

    } else {
      if (name.length < 2 ) {
        if (Object.keys(val).length > 0) {
          val.name = null;
          val.page = 0;
          this.mainParams$.next(val);
        } else {
          this.mainParams$.next({page: 0});
        }
      }
    }
  }

  resetNameAndGroupId(): void {
    const {gid, name, ...alt} = this.mainParams$.getValue();
    alt.page = 0;
    this.mainParams$.next(alt);
}

  createSort(field: string, order: string): void {
    const val = { ...this.mainParams$.getValue()};
    const relevantString = `${field},${order}`;
    if (Object.keys(val).length > 0) {
      val.page = 0;
      const arr = val.sort;
      if (arr) {
        const index = arr.findIndex(s => s.startsWith(field));
        if (index !== -1) {
          arr[index] = relevantString;
          val.sort = arr;
          this.mainParams$.next(val);
        } else {
          val.sort = arr.concat(relevantString);
          this.mainParams$.next(val);
        }
      } else {
        val.sort = [relevantString];
        this.mainParams$.next(val);
      }

    } else {
      this.mainParams$.next({sort: [relevantString]});
    }
  }

  getMainParams(): Observable<ParamsDTO> {
    return this.mainParams$.asObservable();
  }

  setGroupIdFilter(groupIds: number[]): void {
    const val = { ...this.mainParams$.getValue()};
    if (Object.keys(val).length > 0) {
      val.page = 0;
      if (groupIds.length > 0) {
        val.gid = groupIds;
        this.mainParams$.next(val);
      } else {
        val.gid = null;
        this.mainParams$.next(val);
      }
    } else {
      if (groupIds.length > 0) {
        this.mainParams$.next({gid: groupIds});
      }
    }
  }
}
