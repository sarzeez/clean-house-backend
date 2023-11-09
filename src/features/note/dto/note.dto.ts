import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Rating } from '../entity/note.entity';

export class NoteDto {
  @IsNotEmpty()
  @IsString()
  description: string;

  @IsInt()
  @Min(0)
  @Max(5)
  rating: Rating;

  @IsNumber()
  @IsInt()
  employId: number;
}
