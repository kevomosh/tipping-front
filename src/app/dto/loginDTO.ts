import {GroupDTO} from './groupDTO';

export interface LoginDTO {
  token: string;
  username: string;
  nrlGroups: GroupDTO[];
  aflGroups: GroupDTO[];
}
