import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from './services/user.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {ParamService} from './services/param.service';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {AuthService} from '../auth/service/auth.service';
import {LoadingService} from '../shared/services/loading.service';
import {combineLatest, throwError} from 'rxjs';
import {NotifierService} from '../shared/services/notifier.service';


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
              private notifierService: NotifierService,
              private authService: AuthService) {
  }

  stream$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      const groups$ = comp === 'nrl' ? this.authService.nrlGroups$ : this.authService.aflGroups$;
      this.paramService.setGroupIdFilter([]);

      return combineLatest([this.userService.getResults(comp),
        this.loadingService.tableIsLoading, groups$]).pipe(
        map(([res, loading, groups]) => ({
          res,
          loading,
          groups
        })),
        catchError(error => {
          if (error.error.status === 401) {
            const btnUrls = ['/auth'];
            const btnLabels = ['Login'];
            this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
          }
          return throwError(error);
        })
      );
    })
  );


  ngOnInit(): void {
  }

  setPage(event: any): void {
    this.paramService.initializePagination(event.offset, event.pageSize);
  }

  // TODO OFFER HIT FOR NAME IN FILTER BOX, ATLEAST 3 LETTERS
  // TODO sort for total score doesnt work but last week score works, sends out correct params but no idea why
  // TODO no response. starting happening when chaged databale exteral sorting to true. Baiscally one works then the otherr doesnt
  onSort(event: any): void {
    const sort = event.sorts[0];
    const field = sort.prop === 'lastWeekScore' ? 'ls' : 'ts';
    this.paramService.createSort(field, sort.dir);
  }

  ngOnDestroy(): void {
    this.paramService.resetParams();
  }

}
