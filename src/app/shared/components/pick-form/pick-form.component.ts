import {Component, Input, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges} from '@angular/core';
import {GamesForWeekDTO} from '../../../dto/gamesForWeekDTO';
import {Form, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameDTO} from '../../../dto/gameDTO';
import {PlayerDTO} from '../../../dto/playerDTO';
import {MakePickView} from '../../../views/makePickView';
import {PickView} from '../../../views/pickView';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../../user/services/user.service';
import {AdminService} from '../../../admin/services/admin.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-pick-form',
  templateUrl: './pick-form.component.html',
  styleUrls: ['./pick-form.component.scss']
})
export class PickFormComponent implements  OnDestroy, OnChanges {

  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar,
              public uzerService: UserService,
              public adminService: AdminService) { }
  @Input() info: GamesForWeekDTO;
  @Input() limit: number;
  @Input() isAdmin: boolean;
  @Output() submitForm = new EventEmitter<MakePickView>();

  pickForm =  this.fb.group({
    teamsSelected: this.fb.array([]),
  });

  playerList: {both: string; name: string}[] = [];
  private destroy$ = new Subject<void>();
  // @ts-ignore
  dataTransfer$ = this.isAdmin ? this.adminService.dataTransfer$ : this.uzerService.dataTransfer$;


  ngOnChanges(changes: SimpleChanges): void {
    const latestInfoValue = changes.info.currentValue;
    this.populateForm(latestInfoValue.games, latestInfoValue.players);
    this.updateFormIfPickPresent(latestInfoValue);
  }

  populateForm(games: GameDTO[], players: PlayerDTO[]): void {
    if (games.length > 0) {
      this.updateForm(games);
      if (games.some(g => g.gameNumber === 2)) {
        this.playerList = players.map(p => ({
          both: p.name + '  (' + p.team + ')',
          name: p.name
        }));
      }
    }
  }

  updateFormIfPickPresent(info: GamesForWeekDTO): void {
    if (!this.isAdmin && info.pickOfWeek !== null) {
      this.snackBar.open('Have already been filled out', '', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
      const pick = info.pickOfWeek.teamsSelected;
      const controls = this.teamsSelectedArray().controls;

      for (let i = 0; i < controls.length ; i++) {
        controls[i].patchValue({team: pick[i].team});
        if (controls[i].value.gameNumber === 1) {
          const player = this.playerList.find(x => x.name === info.pickOfWeek.firstScorer);
          controls[i].patchValue({firstScorer: player});
        }
        if (controls[i].value.gameNumber === 2) {
          controls[i].patchValue({margin: info.pickOfWeek.margin});
        }
      }
    }
  }


  onSubmit(): void{
    const val = this.pickForm.value.teamsSelected;
    const info: MakePickView = {
      weekNumber: this.info.weekNumber,
      selectedViewList: val.map(elem => ({
        gameNumber: elem.gameNumber,
        team: elem.team
      }))
    };
    if (this.info.games.some(g => g.gameNumber === 1)) {
      info.firstScorer = val.find(g => g.gameNumber === 1).firstScorer.name;
    }
    if (this.info.games.some(g => g.gameNumber === 2)) {
      info.margin = val.find(g => g.gameNumber === 2).margin;
    }
    this.submitForm.emit(info);
  }

  getRandomScorer(players: PlayerDTO[], i: number): void {
    const index = Math.floor(Math.random() * players.length);
    const p = players[index];
    const randomPlayer = {
      both: p.name + '  (' + p.team + ')',
      name: p.name
    };

    this.teamsSelectedArray().controls[i].patchValue({firstScorer: randomPlayer});
  }

  getRandomMargin(i: number): void {
    const margin = Math.floor(Math.random() * this.limit);
    this.teamsSelectedArray().controls[i].patchValue({margin});
  }

  private updateForm(games: GameDTO[]): void {
    const arr = [];
    games.forEach(g => arr.push(this.buildPick(g)));
    this.pickForm.setControl('teamsSelected', this.fb.array(arr));
  }

  private buildPick(game: GameDTO): FormGroup {
    return this.fb.group({
      gameNumber: [game.gameNumber],
      firstScorer: [''],
      margin: [''],
      team: ['', Validators.required],
      homeTeam: [game.homeTeam],
      awayTeam: [game.awayTeam]
    });
  }

   teamsSelectedArray(): FormArray {
    return this.pickForm.get('teamsSelected') as FormArray;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.snackBar.dismiss();
  }

}
