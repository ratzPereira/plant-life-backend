import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlantService } from '../src/post/service/plant.service';
import { PlantType, PlantTypeSchema } from '../src/post/model/PlantType';
import { Plant, PlantSchema } from '../src/post/model/Plant';
import { AppModule } from '../src/app.module';
import { User } from '../src/user/models/User';
import { AuthService } from '../src/user/service/auth.service';
import { UserService } from '../src/user/service/user.service';
import mongoose from 'mongoose';
import { INestApplication } from '@nestjs/common';

describe('PlantService (e2e)', () => {
  let app: INestApplication;
  let plantService: PlantService;
  let mongoServer: MongoMemoryServer;
  let plantModel: Model<Plant>;
  let plantTypeModel: Model<PlantType>;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    plantService = app.get<PlantService>(PlantService);
    plantModel = app.get<Model<Plant>>(getModelToken(Plant.name));
    plantTypeModel = app.get<Model<PlantType>>(getModelToken(PlantType.name));

    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await plantModel.deleteMany({});
    await plantTypeModel.deleteMany({});
  });
  describe('getPlantSpecies', () => {
    it('should return an array of species for a given plant type', async () => {
      // Create some test plant types with species
      const plantTypes = [
        {
          name: 'Type A',
          species: ['Species 1', 'Species 2'],
        },
        {
          name: 'Type B',
          species: ['Species 3', 'Species 4'],
        },
      ];
      await plantTypeModel.create(plantTypes);

      // Test the getPlantSpecies method for each plant type
      for (const plantType of plantTypes) {
        const species = await plantService.getPlantSpecies(plantType.name);
        expect(species).toEqual(plantType.species);
      }
    });

    it('should throw an error if plant type not found', async () => {
      // Test the getPlantSpecies method for a non-existent plant type
      await expect(plantService.getPlantSpecies('Type C')).rejects.toThrowError(
        `Plant type with name 'Type C' not found.`,
      );
    });
  });
});
