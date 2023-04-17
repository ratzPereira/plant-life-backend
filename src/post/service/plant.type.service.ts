import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlantType, PlantTypeDocument } from '../model/PlantType';

@Injectable()
export class PlantTypeService {
  constructor(
    @InjectModel(PlantType.name)
    private readonly plantTypeModel: Model<PlantTypeDocument>,
  ) {}

  async findPlantTypeByName(name: string): Promise<PlantType> {
    return await this.plantTypeModel.findOne({ name }).exec();
  }

  async isPlantTypeValid(name: string): Promise<boolean> {
    const plantType = await this.findPlantTypeByName(name);
    return !!plantType;
  }

  async isPlantSpeciesValid(type: string, species: string): Promise<boolean> {
    const plantType = await this.findPlantTypeByName(type);
    if (!plantType) {
      return false;
    }
    const validSpecies = plantType.species || [];
    return validSpecies.includes(species);
  }
}
