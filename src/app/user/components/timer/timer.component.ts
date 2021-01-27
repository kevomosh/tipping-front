import { Component, OnInit, Input } from '@angular/core';
import {DeadLineDTO} from '../../../dto/deadLineDTO';
import {interval} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  constructor() { }

  @Input() deadline: Date;

  timer$ = interval(1000).pipe(
    map(() => this.getDateTime())
  );
  ngOnInit(): void {
  }

  private getDateTime(): DeadLineDTO {
    let res: DeadLineDTO = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };
    const deadlineTime = new Date(this.deadline).getTime();
    const currentTime =  new Date().getTime();
    if (deadlineTime > currentTime) {
      const dist = deadlineTime - currentTime;
      const days = Math.floor(dist / (1000 * 60 * 60 * 24));
      const hours = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((dist % (1000 * 60)) / 1000);
      res = {
        days,
        hours,
        minutes,
        seconds,
      };
    }
    return res;
  }

}
