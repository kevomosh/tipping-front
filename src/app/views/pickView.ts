import { SelectedView } from './selectedView';

export interface PickView{
    userId: number;
    weekNumber: number;
    margin: number;
    firstScorer: string;
    selectedViewList: SelectedView[];

}