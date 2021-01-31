import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminService} from './services/admin.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap, takeUntil} from 'rxjs/operators';
import {MakePickView} from '../views/makePickView';
import {combineLatest, of, Subject} from 'rxjs';
import {SelectedView} from '../views/selectedView';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder,
              private adminService: AdminService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { }

  private destroy$ = new Subject<void>();

  combined$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      const lim = comp === 'nrl' ? 60 : 90;
      const limit$ = of(lim);

      return  combineLatest([this.adminService.getGamesToUpdate(comp), limit$, of(comp)]).pipe(
        map(([gamesInfo, limit, competition]) => ({
          gamesInfo,
          limit,
          competition
        }) )
      );
    })
  );

  ngOnInit(): void {
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

    }, error => {

    });
  }

  updateTotalScore(comp: string): void {
    this.adminService.updateTotalScore(comp).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      console.log(res);
      const url = `/user/results/${comp}`;
      this.router.navigateByUrl(url);
    }, error => {

    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
