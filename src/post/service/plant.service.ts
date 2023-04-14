import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plant, PlantDocument } from '../model/Plant';
import { Model } from 'mongoose';
import { CreatePlantTypeDto } from '../dto/create.plant.type.dto';
import { PlantType, PlantTypeDocument } from '../model/PlantType';
import { PlantSpecies, PlantSpeciesDocument } from '../model/PlantSpecies';
import { CreatePlantSpeciesDto } from '../dto/create.plant.species.dto';

class CreatePlantDto {}

@Injectable()
export class PlantService {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
    @InjectModel(PlantType.name)
    private readonly plantTypeModel: Model<PlantTypeDocument>,
    @InjectModel(PlantSpecies.name)
    private readonly plantSpeciesModel: Model<PlantSpeciesDocument>,
  ) {}

  async createPlant(createPlantDto: CreatePlantDto): Promise<Plant> {
    const createdPlant = new this.plantModel(createPlantDto);
    return createdPlant.save();
  }

  async findPlantById(id: string): Promise<Plant> {
    return this.plantModel.findById(id).exec();
  }

  async createPlantType(
    createPlantTypeDto: CreatePlantTypeDto,
  ): Promise<PlantType> {
    const createdPlantType = new this.plantTypeModel(createPlantTypeDto);
    return createdPlantType.save();
  }

  async getAllPlantTypes(): Promise<PlantType[]> {
    return this.plantTypeModel.find().populate('species').exec();
  }

  async getAllPlantSpecies(): Promise<PlantSpecies[]> {
    return this.plantSpeciesModel.find().populate('type', 'name').exec();
  }

  async createPlantSpecies(
    plantSpeciesDto: CreatePlantSpeciesDto,
  ): Promise<PlantSpecies> {
    // Primeiro, verificamos se o plant type passado já existe na base de dados
    const plantType = await this.plantTypeModel
      .findById(plantSpeciesDto.type)
      .exec();
    if (!plantType) {
      throw new Error(`Plant type with id ${plantSpeciesDto.type} not found.`);
    }

    // Se existir, criamos a nova plant species
    const plantSpecies = new this.plantSpeciesModel(plantSpeciesDto);
    plantSpecies.type = plantType;

    return await plantSpecies.save();
  }
}
