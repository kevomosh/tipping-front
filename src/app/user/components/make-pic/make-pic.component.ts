import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {ActivatedRoute} from '@angular/router';
import {switchMap, tap} from 'rxjs/operators';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {GameDTO} from '../../../dto/gameDTO';
import {PlayerDTO} from '../../../dto/playerDTO';
import {isElementScrolledOutsideView} from '@angular/cdk/overlay/position/scroll-clip';
import {MakePickView} from '../../../views/makePickView';

@Component({
  selector: 'app-make-pic',
  templateUrl: './make-pic.component.html',
  styleUrls: ['./make-pic.component.scss']
})
export class MakePicComponent implements OnInit {

  constructor(private userService: UserService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute) { }


  limit = 50;

  info$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      this.limit = comp === 'nrl' ? 60 : 90;
      // tslint:disable-next-line:radix
      const weekNumber = parseInt(param.get('weekNumber')) ;
      return this.userService.getGames(comp, weekNumber);
    })
  );

  ngOnInit(): void {
  }

  onSubmitForm(event: MakePickView): void {
    console.log(event);
  }
}
