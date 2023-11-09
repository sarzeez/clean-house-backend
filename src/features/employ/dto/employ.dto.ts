import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Category } from '../entity/employ.entity';

export class EmployDto {
  @IsNotEmpty()
  @IsEnum(Category)
  category: Category;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNumber()
  price: number;
}

export class CreateEmployDto extends EmployDto {
  @IsNumber()
  createdBy: number;
}
