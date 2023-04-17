import { IsNotEmpty } from 'class-validator';

export class PlantPostDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  species: string;
  @IsNotEmpty()
  age: number;
  @IsNotEmpty()
  location: string;
  @IsNotEmpty()
  plantType: string; // novo campo para o tipo de planta
}
