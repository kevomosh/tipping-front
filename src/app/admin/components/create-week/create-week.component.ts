import {Component, OnDestroy, OnInit} from '@angular/core';
import {AdminService} from '../../services/admin.service';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {switchMap, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {NotifierService} from '../../../shared/services/notifier.service';
import {AlertDTO} from '../../../dto/AlertDTO';

@Component({
  selector: 'app-create-week',
  templateUrl: './create-week.component.html',
  styleUrls: ['./create-week.component.scss']
})
export class CreateWeekComponent implements OnInit, OnDestroy {

  constructor(private adminService: AdminService,
              private fb: FormBuilder,
              private notifierService: NotifierService,
              private ativatedRoute: ActivatedRoute) { }


    newWeekForm = this.fb.group({
    weekNumber: ['', Validators.required],
    deadLine: ['', Validators.required],
    matchesThisWeek: this.fb.array([this.addMatchGroup()]),
  });

  private destroy$ = new Subject<void>();
  competition: string;

  weekNumberRange: number[] = Array.from({ length: 30 }, (v, k) => k + 1);
  gameNumberRange: number[] = Array.from({ length: 9 }, (v, k) => k + 1);

  minimum = new Date();

  combined$ =  this.ativatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      this.competition = comp;
      return this.adminService.getAllTeams(comp);
    })
  );

  ngOnInit(): void {

  }

  private addMatchGroup(): FormGroup {
   return this.fb.group({
      gameNumber: ['', Validators.required],
      homeTeam: ['', Validators.required],
      awayTeam: ['', Validators.required]
    });
  }

  groupFormArray(): FormArray {
    return this.newWeekForm.get('matchesThisWeek') as FormArray;
  }

  addMatchButtonClick(): void {
    this.groupFormArray().push(this.addMatchGroup());
  }

  removeMatchButtonClick(index: number): void {
    this.groupFormArray().removeAt(index);
  }

  onSubmit = () => {
    const val = this.newWeekForm.value ;
    const  timestamp = new Date(val.deadLine);
    const off = (timestamp.getTimezoneOffset() / 60).toString().substring(1);
    const dateView = {
      month: timestamp.getMonth() + 1,
      day: timestamp.getDate(),
      offset: `+${off}`,
      hour: timestamp.getHours(),
      minute: timestamp.getMinutes()
    };

    const info = {
      weekNumber: val.weekNumber,
      dateView,
      gamesToPlay: val.matchesThisWeek
    };

    this.adminService.createWeek(this.competition, info).pipe(
      takeUntil(this.destroy$)
    ).subscribe(res => {
      console.log(res);
    }, error => {
      const btnUrl = `/admin/create-week/${this.competition}`;
      const e = error.error;
      const alert = new AlertDTO(e.status, e.error, e.message,
        5000, 'error', ['Please try again'], [btnUrl]);
      this.notifierService.showNotification(alert);
      this.newWeekForm.reset();
    });

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
