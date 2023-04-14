import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plant, PlantDocument } from '../model/Plant';
import { Model } from 'mongoose';

class CreatePlantDto {}

@Injectable()
export class PlantService {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
  ) {}

  async createPlant(createPlantDto: CreatePlantDto): Promise<Plant> {
    const createdPlant = new this.plantModel(createPlantDto);
    return createdPlant.save();
  }

  async findPlantById(id: string): Promise<Plant> {
    return this.plantModel.findById(id).exec();
  }
}
