import { IsArray, IsString } from 'class-validator';

export class SelectedProjectFutureProcessData {
  @IsString()
  projectId: string;

  @IsArray()
  selected: Array<any>;

  @IsArray()
  unselected: Array<any>;

  @IsArray()
  deleted: Array<any>;
}
