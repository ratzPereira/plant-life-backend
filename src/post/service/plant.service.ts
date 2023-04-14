import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plant, PlantDocument } from '../model/Plant';
import { Model } from 'mongoose';
import { CreatePlantTypeDto } from '../dto/create.plant.type.dto';
import { PlantType, PlantTypeDocument } from '../model/PlantType';
import { CreatePlantSpeciesDto } from '../dto/create.plant.species.dto';

class CreatePlantDto {}

@Injectable()
export class PlantService {
  constructor(
    @InjectModel(Plant.name) private readonly plantModel: Model<PlantDocument>,
    @InjectModel(PlantType.name)
    private readonly plantTypeModel: Model<PlantTypeDocument>,
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
    const existingPlantType = await this.plantTypeModel
      .findOne({ name: createPlantTypeDto.name })
      .exec();
    if (existingPlantType) {
      throw new BadRequestException(
        `Plant type with name '${createPlantTypeDto.name}' already exists`,
      );
    }
    const createdPlantType = new this.plantTypeModel(createPlantTypeDto);
    return createdPlantType.save();
  }

  async getAllPlantTypes(): Promise<PlantType[]> {
    return this.plantTypeModel.find().exec();
  }

  async addSpeciesToPlantType(
    createPlantSpeciesDto: CreatePlantSpeciesDto,
  ): Promise<PlantType> {
    const { plantType, species } = createPlantSpeciesDto;

    const foundPlantType = await this.plantTypeModel
      .findOne({ name: plantType })
      .exec();

    if (!foundPlantType) {
      throw new NotFoundException(
        `PlantType with name '${plantType}' not found`,
      );
    }

    if (Array.isArray(species)) {
      for (const s of species) {
        if (foundPlantType.species.includes(s)) {
          throw new BadRequestException(
            `The species '${s}' already exists in the '${plantType}' plant type`,
          );
        }
      }
      foundPlantType.species.push(...species);
    } else {
      if (foundPlantType.species.includes(species)) {
        throw new BadRequestException(
          `The species '${species}' already exists in the '${plantType}' plant type`,
        );
      }
      foundPlantType.species.push(species);
    }

    return await foundPlantType.save();
  }

  async getPlantSpecies(plantType: string): Promise<string[]> {
    const plantTypeObj = await this.plantTypeModel
      .findById(plantType)
      .populate('species')
      .exec();

    if (!plantTypeObj) {
      throw new Error(`Plant type with ID ${plantType} not found.`);
    }

    return plantTypeObj.species.map((species) => species);
  }
}
