import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Gender } from '../entity/profile.entity';
import { Type } from 'class-transformer';
import { FileDto } from '@/features/file/dto/file.dto';

export class UserProfileDto {
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNumber()
  @Type(() => Number)
  age: number;
}

export class ProfileDto {
  gender: Gender;
  age: number;
  file: FileDto;
}
