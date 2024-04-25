import { IsEnum, IsObject, IsString } from 'class-validator';
import { ReferenceType } from '../../modules/text-block/entities/reference-type.enum';

export class ReferenceData {
  @IsString()
  referenceId: string;

  @IsEnum(ReferenceType)
  type: ReferenceType;

  @IsObject()
  metadata: object;
}
