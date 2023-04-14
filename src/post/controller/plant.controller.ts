import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlantService } from '../service/plant.service';
import { PlantType } from '../model/PlantType';
import { CreatePlantTypeDto } from '../dto/create.plant.type.dto';
import { CreatePlantSpeciesDto } from '../dto/create.plant.species.dto';

@Controller('/api/plants')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post('/types')
  async createPlantType(
    @Body() createPlantTypeDto: CreatePlantTypeDto,
  ): Promise<PlantType> {
    return this.plantService.createPlantType(createPlantTypeDto);
  }

  @Get('/types')
  async getAllPlantTypes(): Promise<PlantType[]> {
    return this.plantService.getAllPlantTypes();
  }

  @Post('/species')
  async createPlantSpecies(
    @Body() createPlantSpeciesDto: CreatePlantSpeciesDto,
  ) {
    return await this.plantService.addSpeciesToPlantType(createPlantSpeciesDto);
  }

  @Get('/species/:plantType')
  async getPlantSpecies(@Param('plantType') plantType: string) {
    return await this.plantService.getPlantSpecies(plantType);
  }
}
