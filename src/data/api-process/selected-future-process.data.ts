import { IsString, IsOptional } from 'class-validator';

export class SelectedFutureProcessData {
  @IsString()
  code: string;

  @IsString()
  futureProcessId: string;

  @IsString()
  spcName: string;

  @IsString()
  futureProcessName: string;

  @IsString()
  @IsOptional()
  parent: string | null;

  @IsString()
  projectId: string;

  @IsString()
  visibleCode: string;
}
