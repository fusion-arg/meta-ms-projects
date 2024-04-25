import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsOptional } from 'class-validator';
import { ProjectData } from './project.data';

export class UpdateProjectData extends ProjectData {
  @ApiProperty({
    example: 'base64',
  })
  @IsBase64()
  @IsOptional()
  logo?: string;
}
