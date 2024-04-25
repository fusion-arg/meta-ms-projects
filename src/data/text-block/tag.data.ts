import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TagData {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}
