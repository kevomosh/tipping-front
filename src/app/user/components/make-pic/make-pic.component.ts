import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MakePickView} from '../../../views/makePickView';
import {BehaviorSubject, Subject, throwError} from 'rxjs';
import {NotifierService} from '../../../shared/services/notifier.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-make-pic',
  templateUrl: './make-pic.component.html',
  styleUrls: ['./make-pic.component.scss']
})
export class MakePicComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private notifierService: NotifierService,
              private activatedRoute: ActivatedRoute,
              private router: Router
             ) { }

  limit = 50;
  compStr: string;
  private destroy$ = new Subject<void>();
  httpError$ = new BehaviorSubject(false);
  weekNumber: number;
  fwp: boolean;

  dataTransfer$ = this.userService.dataTransfer$;
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
      this.weekNumber = res.weekNumber;
      this.fwp = res.fwp;
      this.userService.setDataTransfer(false);
    }),
    catchError(error => {
      this.userService.setDataTransfer(false);
      this.handleError(error);
      return throwError(error);
    })
  );

  handleError(error: HttpErrorResponse): void {
    this.httpError$.next(true);
    const btnUrls: string[] = [];
    const btnLabels: string[] = [];
    const e = error.error;
    const latestRound = `/user/make-pick/${this.compStr}`;
    const relevantRound = e.message.charAt(e.message.length - 1);

    if (e.message.startsWith('Past')) {
      btnUrls.push(`${latestRound}/${relevantRound}`);
      btnLabels.push('Next Round');
      btnUrls.push(`/user/pick/${this.compStr}`);
      btnLabels.push('Latest Picks');
    } else if (e.message.startsWith('Its')){
      btnUrls.push(`${latestRound}`);
      btnLabels.push('Latest Round');
      btnUrls.push(`/user/pick/${this.compStr}/${relevantRound}`);
      btnLabels.push('Members picks');
    } else {
      btnUrls.push(`${latestRound}`);
      btnLabels.push('Latest Round');
      btnUrls.push(`/user/pick/${this.compStr}`);
      btnLabels.push('Latest Picks');
    }
    this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
  }

  ngOnInit(): void {
  }

  // TOD AFETR SUCCESSUL CREATION TIP, SECOND BUTTON IN DIALOG
  // TAKES TO FOLLOWING WEEK IN PICKS AND NOT IN MAKE PICK AS IS SHOULD
  onSubmitForm(event: MakePickView): void {
    this.userService.createPick(this.compStr, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.handleSuccess(res.message);
    }, error => {
      this.handleSubmitError(error);
    });
  }

  handleSuccess(message: string): void {
    this.userService.setDataTransfer(false);
    const nxtWeek = this.weekNumber + 1;
    const btnUrls = [`/user/pick/${this.compStr}/${this.weekNumber}`];
    const btnLabels = ['View Picks for week'];
    if (this.fwp) {
      btnUrls.push(`/user/make-pick/${this.compStr}/${nxtWeek}`);
      btnLabels.push('Next Round');
    }
    this.notifierService.displaySuccessDialog(message, btnUrls, btnLabels);
  }

  handleSubmitError(error: HttpErrorResponse): void {
    this.userService.setDataTransfer(false);
    const btnUrls = [
      `/user/make-pic/${this.compStr}/${this.weekNumber}`,
      `/user/make-pic/${this.compStr}`];
    const btnLabels = ['Try again', 'Latest Week Games'];
    this.notifierService.displayErrorDialog(error, btnUrls, btnLabels);
  }

  navigateToWeek(weekNumber: number): void {
    const url = `/user/make-pick/${this.compStr}/${weekNumber}`;
    this.router.navigateByUrl(url);
  }

  previousNotZero(weeknumber: number): boolean {
    return weeknumber === 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
