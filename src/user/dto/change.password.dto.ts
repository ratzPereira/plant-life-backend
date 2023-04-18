import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsNotEmpty()
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
