import {PickDTO} from './PickDTO';
import {TeamSelectedDTO} from './teamSelectedDTO';
import {GameDTO} from './gameDTO';

export interface PickResultDTO {
  total: number;
  pageNumber: number;
  fwp: boolean;
  firstScorer: string;
  margin: number;
  picks: PickDTO[];
  winners: TeamSelectedDTO[];
  gamesForWeek: GameDTO[];
  deadLine: Date;
  weekNumber: number;
}
