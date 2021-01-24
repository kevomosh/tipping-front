import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {UserService} from '../../services/user.service';
import {map, switchMap, tap} from 'rxjs/operators';
import {ColumnMode} from '@swimlane/ngx-datatable';
import {TeamSelectedDTO} from '../../../dto/teamSelectedDTO';
import {ParamService} from '../../services/param.service';
import {AuthService} from '../../../auth/service/auth.service';
import {combineLatest} from 'rxjs';
import {LoadingService} from '../../../shared/services/loading.service';


@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.scss']
})
export class PickComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private paramService: ParamService,
              private authService: AuthService,
              private loadingService: LoadingService) { }

  ColumnMode = ColumnMode;
  winners: TeamSelectedDTO[] = [];
  rows = [];
  gameColumnNames: string[] ;
  loading = true;

  groups$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      return  comp === 'nrl' ? this.authService.nrlGroups$ : this.authService.aflGroups$;
    })
  );


  result$ = this.activatedRoute.paramMap.pipe(
    switchMap(param => {
      const comp = param.get('comp');
      // tslint:disable-next-line:radix
      const weekNumber = parseInt(param.get('weekNumber')) ;
      return  combineLatest([this.userService.getPicks(comp, weekNumber),
        this.loadingService.tableIsLoading]).pipe(
        map(([result, isLoading]) => ({
          result,
          isLoading
        }))
      );
    }),
    tap(res => {
      this.gameColumnNames = [];
      this.winners = res.result.winners;
      const picks = res.result.picks;
      const games = res.result.gamesForWeek;
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < games.length; i++  ) {
        this.gameColumnNames.push('gameNumber' +  String(games[i].gameNumber));
      }
      this.rows = picks.map(p => {
        const {teamsSelected, id, weekNumber, comp, ...others} = p;
        // @ts-ignore
        const teamsList = teamsSelected.map((team, index) => ({
            ['gameNumber' + Number(index + 1) ] : team.team
        }));
        const teamObj = Object.assign({}, ...teamsList);
        return  {...others, ...teamObj};
      });

    })

  );

  ngOnInit(): void {

  }

  isSelectionWinner(index: number, pick: string): boolean {
    const length = this.winners.length;
    if ( length > 0 && length > index) {
      return this.winners[index].team === pick;
    }
  }

  setPage(event: any): void {
    this.paramService.initializePagination(event.offset, event.pageSize);
  }

}
