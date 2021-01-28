import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil, tap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {GameDTO} from '../../../dto/gameDTO';
import {PlayerDTO} from '../../../dto/playerDTO';
import {MakePickView} from '../../../views/makePickView';
import {Subject} from 'rxjs';
import {AlertDTO} from '../../../dto/AlertDTO';
import {NotifierService} from '../../../shared/services/notifier.service';

@Component({
  selector: 'app-make-pic',
  templateUrl: './make-pic.component.html',
  styleUrls: ['./make-pic.component.scss']
})
export class MakePicComponent implements OnInit, OnDestroy {

  constructor(private userService: UserService,
              private notifierService: NotifierService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute) { }


  limit = 50;
  private destroy$ = new Subject<void>();
  competition: string;

  info$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      this.competition = comp;
      this.limit = comp === 'nrl' ? 60 : 90;
      // tslint:disable-next-line:radix
      const weekNumber = parseInt(param.get('weekNumber')) ;
      return this.userService.getGames(comp, weekNumber);
    })
  );

  ngOnInit(): void {
  }

  // TODO get relevant buttons and ulrs , either following week or check weeks pick;
  // TODO ALERTDTO, remove vertical position if can figure out how to place it in the middle
  onSubmitForm(event: MakePickView): void {
    this.userService.createPick(this.competition, event)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
      console.log(res);
    }, error => {
      const e = error.error;
      const alert = new AlertDTO(e.status, e.error, e.message, 'bottom',
        5000, 'error', ['Please try again'], ['/auth']);
      this.notifierService.showNotification(alert);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
