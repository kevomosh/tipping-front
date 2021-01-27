import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {GamesForWeekDTO} from '../../../dto/gamesForWeekDTO';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GameDTO} from '../../../dto/gameDTO';
import {PlayerDTO} from '../../../dto/playerDTO';
import {MakePickView} from '../../../views/makePickView';
import {PickView} from '../../../views/pickView';

@Component({
  selector: 'app-pick-form',
  templateUrl: './pick-form.component.html',
  styleUrls: ['./pick-form.component.scss']
})
export class PickFormComponent implements OnInit {

  constructor(private fb: FormBuilder) { }
  @Input() info: GamesForWeekDTO;
  @Input() limit: number;
  @Input() isAdmin: boolean;
  @Output() submitForm = new EventEmitter<MakePickView>();

  pickForm =  this.fb.group({
    teamsSelected: this.fb.array([]),
  });

  controls: any;
  playerList: {both: string; name: string}[] = [];

  ngOnInit(): void {
    this.updateForm(this.info.games);
    this.controls = this.teamsSelectedArrayControls();
    this.playerList = this.info.players.map(p => ({
    both: p.name + '  (' + p.team + ')',
    name: p.name
  }));
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

    this.controls[i].patchValue({firstScorer: randomPlayer});
  }

  getRandomMargin(i: number): void {
    const margin = Math.floor(Math.random() * this.limit);
    this.controls[i].patchValue({margin});
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

  private teamsSelectedArrayControls(): any {
    return (this.pickForm.get('teamsSelected') as FormArray).controls;
  }
}
