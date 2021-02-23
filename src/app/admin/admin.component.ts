import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminService} from './services/admin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, map, switchMap, takeUntil} from 'rxjs/operators';
import {MakePickView} from '../views/makePickView';
import {combineLatest, of, Subject, throwError} from 'rxjs';
import {SelectedView} from '../views/selectedView';
import {HttpErrorResponse} from '@angular/common/http';
import {NotifierService} from '../shared/services/notifier.service';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              public adminService: AdminService,
              private activatedRoute: ActivatedRoute,
              private notifierService: NotifierService,
              private router: Router) { }

  private destroy$ = new Subject<void>();
  private compStr: string;

  combined$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      const lim = comp === 'nrl' ? 60 : 90;
      this.compStr = comp === 'nrl' ? 'nrl' : 'afl';
      const limit$ = of(lim);

      return  combineLatest([this.adminService.getGamesToUpdate(comp), limit$, of(comp)]).pipe(
        map(([gamesInfo, limit, competition]) => ({
          gamesInfo,
          limit,
          competition
        })),
        catchError(error => {
          this.handleError(error);
          return throwError(error);
        })
      );
    })
  );

  ngOnInit(): void {
  }

  handleError(error: HttpErrorResponse): void {
    const btnUrls = [
      `/user/results/${this.compStr}`,
      `/user/pick/${this.compStr}`
    ];
    const btnLabels = ['Results', 'Picks For Week'];
    this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
  }

  onSubmitForm(event: MakePickView, competition: string): void {
    const info: {resultViewSet: SelectedView[], margin?: number, firstScorer?: string} = {
      resultViewSet: event.selectedViewList.filter(s => s.team.length > 2)
    };
    if (event.firstScorer) {
      info.firstScorer = event.firstScorer;
    }
    if (event.margin) {
      info.margin = event.margin;
    }
    this.adminService.addResults(competition, info).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.adminService.setDataTransfer(false);
      this.router.navigateByUrl(`/user/results/${this.compStr}`);
    }, error => {
        this.handleError(error);
    });
  }

  handleSubmitError(error: HttpErrorResponse): void {
    this.adminService.setDataTransfer(false);
    const btnUrls = [`/user/results/${this.compStr}`];
    const btnLabels = ['Go back to result and try again'];
    this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
  }

  updateTotalScore(comp: string): void {
    this.adminService.updateTotalScore(comp).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      this.adminService.setDataTransfer(false);
      console.log(res);
      const url = `/user/results/${comp}`;
      this.router.navigateByUrl(url);
    }, error => {
      this.handleSubmitError(error);
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
