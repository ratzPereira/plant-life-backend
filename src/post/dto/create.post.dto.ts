import { IsNotEmpty } from 'class-validator';
import { Plant } from '../model/Plant';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  plant: Plant;
}
