import {GameDTO} from './gameDTO';
import {PlayerDTO} from './playerDTO';

export interface GamesForWeekDTO {
  deadLine: Date;
  weekNumber: number;
  fwp: boolean;
  games: GameDTO[];
  players: PlayerDTO[];
}
