import {UserResultDTO} from './userResultDTO';

export interface ResultDTO {
  total: number;
  latestWeekNumber: number;
  pageNumber: number;
  size: number;
  results: UserResultDTO[];
}
