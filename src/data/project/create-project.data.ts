import { ApiProperty } from '@nestjs/swagger';
import { IsBase64, IsNotEmpty } from 'class-validator';
import { ProjectData } from './project.data';

export class CreateProjectData extends ProjectData {
  @ApiProperty({
    example: 'base64',
  })
  @IsBase64()
  @IsNotEmpty()
  logo: string;
}
