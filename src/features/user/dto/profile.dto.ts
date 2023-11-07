import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Gender } from '../entity/profile.entity';

export class UserProfileDto {
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNumber()
  age: number;
}
