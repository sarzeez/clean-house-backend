import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(25)
  @IsString()
  password: string;
}

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;
}
