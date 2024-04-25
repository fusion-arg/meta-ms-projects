import { IsOptional } from 'class-validator';
import { Sorting } from 'src/contracts/sorting.contract';

export class ProjectSorting implements Sorting {
  @IsOptional()
  id?: 'ASC' | 'DESC';

  @IsOptional()
  name?: 'ASC' | 'DESC';

  @IsOptional()
  industry?: 'ASC' | 'DESC';

  @IsOptional()
  client?: 'ASC' | 'DESC';

  @IsOptional()
  startDate?: 'ASC' | 'DESC';

  @IsOptional()
  dueDate?: 'ASC' | 'DESC';

  @IsOptional()
  createdAt?: 'ASC' | 'DESC';
}
