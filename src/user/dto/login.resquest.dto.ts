import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
