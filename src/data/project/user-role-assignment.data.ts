import { IsString } from 'class-validator';

export class UserRoleAssignmentData {
  @IsString()
  userId: string;

  @IsString()
  projectRole: string;
}
