import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {catchError, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MakePickView} from '../../../views/makePickView';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {AlertDTO} from '../../../dto/AlertDTO';
import {NotifierService} from '../../../shared/services/notifier.service';
import {Alert} from '../../../dto/Alert';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-make-pic',
  templateUrl: './make-pic.component.html',
  styleUrls: ['./make-pic.component.scss']
})
export class MakePicComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute
             ) { }


  limit = 50;
  compStr: string;
  private destroy$ = new Subject<void>();
  httpError$ = new BehaviorSubject(false);

  info$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      this.limit = comp === 'nrl' ? 60 : 90;
      this.compStr = comp === 'nrl' ? 'nrl' : 'afl';
      // tslint:disable-next-line:radix
      const weekNumber = parseInt(param.get('weekNumber')) ;
      return this.userService.getGames(comp, weekNumber);
    }),
    tap(res => {
      console.log(Object.keys(res.pickOfWeek).length);
    }),
    catchError(error => {
      this.handleError(error);
      return throwError(error);
    })
  );

  ngOnInit(): void {
  }

  onSubmitForm(event: MakePickView): void {
    this.userService.createPick(this.compStr, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
      console.log(res);
    }, error => {
      const e = error.error;
      const alert = new AlertDTO(e.status, e.error, e.message,
        5000, 'error', ['Please try again'], ['/auth']);
      this.notifierService.showNotification(alert);
    });
  }

  handleError(error: HttpErrorResponse): void {
    this.httpError$.next(true);
    const e = error.error;
    const btnUrls = [`/user/pick/${this.compStr}`];
    const btnLabels = ['Members Picks'];
    const urlStr1 = `/user/make-pick/${this.compStr}`;
    if (e.message.startsWith('Past')) {
      const nextRound = e.message.charAt(e.message.length - 1);
      btnUrls.push(`${urlStr1}/${nextRound}`);
      btnLabels.push('Next Round');
    } else {
      btnUrls.push(`${urlStr1}`);
      btnLabels.push('Latest');
    }
    const alert: Alert = {
      status: e.status,
      responseHeader: e.error,
      message: e.message,
      btnLabels,
      btnUrls,
    };
    this.notifierService.showErrorDialog(alert);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
