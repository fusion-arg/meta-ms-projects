import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClientData {
  @ApiProperty({
    type: String,
    example: '2f2d72bd-36ee-4e72-bbaf-9746f150c3cf',
  })
  @IsInt()
  @IsOptional()
  id?: string;

  @ApiProperty({
    type: String,
    example: 'ClienteName',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    example: 1,
  })
  @IsUUID()
  industry: string;

  @ApiProperty({
    type: String,
    example:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
  })
  @IsString()
  licenseInformation: string;
}
