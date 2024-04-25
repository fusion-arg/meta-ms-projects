import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { Filter } from 'src/contracts/filter.contract';

export class ProjectFilter implements Filter {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  client?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value.split(','))
  industries?: string[];

  @IsOptional()
  @IsString()
  startDateFrom?: string;

  @IsOptional()
  @IsString()
  startDateTo?: string;

  @IsOptional()
  @IsString()
  dueDateFrom?: string;

  @IsOptional()
  @IsString()
  dueDateTo?: string;

  @IsOptional()
  @IsString()
  createdAtFrom?: string;

  @IsOptional()
  @IsString()
  createdAtTo?: string;
}
