import {
  IS_URL,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserProfileDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @MinLength(4)
  username?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @MinLength(10)
  bio?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @MinLength(4)
  location?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
