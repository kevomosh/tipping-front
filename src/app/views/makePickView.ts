import {SelectedView} from './selectedView';

export interface MakePickView {
  weekNumber: number;
  selectedViewList: SelectedView[];
  margin?: number;
  firstScorer?: string;
}
