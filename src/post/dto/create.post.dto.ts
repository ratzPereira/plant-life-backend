import { IsNotEmpty, IsOptional } from 'class-validator';
import { PlantPostDto } from './plant.post.dto';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;

  image: string[] | string;

  @IsOptional()
  plant?: PlantPostDto;
}
