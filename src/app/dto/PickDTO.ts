import {TeamSelectedDTO} from './teamSelectedDTO';

export interface PickDTO {
  weekNumber: number;
  score: number;
  name: string;
  margin: number;
  firstScorer: string;
  extraPoint: number;
  byUser: boolean;
  teamsSelected: TeamSelectedDTO[];
  id: any;
  comp: string;
}
