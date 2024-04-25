import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TagData } from './tag.data';
import { ReferenceData } from './reference.data';

export class TextBlockData {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TagData)
  @IsOptional()
  tags: TagData[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceData)
  @IsOptional()
  references: ReferenceData[];
}
