import {GameDTO} from './gameDTO';
import {PlayerDTO} from './playerDTO';
import {PickDTO} from './PickDTO';

export interface GamesForWeekDTO {
  deadLine: Date;
  weekNumber: number;
  fwp: boolean;
  games: GameDTO[];
  players: PlayerDTO[];
  pickOfWeek?: PickDTO;
}
