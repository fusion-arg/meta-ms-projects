import { IsString } from 'class-validator';

export class UserProjectAssignmentData {
  @IsString()
  userId: string;
}
