import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsObject, IsString } from 'class-validator';
import { CreateClientData } from '../create-client.data';

export class ProjectData {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '2023-09-30',
  })
  @IsDateString()
  startDate: Date;

  @ApiProperty({
    example: '2024-09-06',
  })
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsObject()
  client: CreateClientData;
}
