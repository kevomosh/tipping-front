import { Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {ParamService} from './services/param.service';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {AuthService} from '../auth/service/auth.service';
import {LoadingService} from '../shared/services/loading.service';
import {combineLatest} from 'rxjs';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy{
  ColumnMode = ColumnMode;
  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute,
              private paramService: ParamService,
              private loadingService: LoadingService,
              private authService: AuthService) { }



  groups$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      return  comp === 'nrl' ? this.authService.nrlGroups$ : this.authService.aflGroups$;
    })
  );

  result$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      return combineLatest([this.userService.getResults(comp), this.loadingService.tableIsLoading]).pipe(
        map(([res, loading]) => ({
          res,
          loading
        }))
      );
    })
  );


  ngOnInit(): void {

  }

  setPage(event: any): void {
    this.paramService.initializePagination(event.offset, event.pageSize);
  }

  // TODO sort for total score doesnt work but last week score works, sends out correct params but no idea why
  // TODO no response. starting happening when chaged databale exteral sorting to true. Baiscally one works then the otherr doesnt
  onSort(event: any): void {
    const sort = event.sorts[0];
    const field = sort.prop === 'lastWeekScore' ? 'ls' : 'ts';
    this.paramService.createSort(field, sort.dir);
  }

  ngOnDestroy(): void {
    this.paramService.resetAll();
  }

}
