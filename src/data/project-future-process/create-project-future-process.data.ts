import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ProcessType } from '../../helpers/enum/processType';

export class CreateProjectFutureProcessData {
  @ApiProperty()
  @IsUUID()
  projectId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEnum(ProcessType)
  type: ProcessType;

  @ApiProperty()
  @IsUUID()
  parent: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  visibleCode: string;
}
