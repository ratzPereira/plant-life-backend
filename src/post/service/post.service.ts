import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../model/Post';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create.post.dto';
import { User } from '../../user/models/User';
import { PlantService } from './plant.service';
import { PlantType } from '../model/PlantType';
import { PlantTypeService } from './plant.type.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(PlantType.name)
    private readonly plantTypeModel: Model<PlantType>,
    private readonly plantService: PlantService,
    private readonly plantTypeService: PlantTypeService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    currentUser: User,
  ): Promise<Post> {
    const post = new this.postModel({
      ...createPostDto,
      user: currentUser,
    });

    if (createPostDto.plant) {
      const plantType = await this.plantTypeService.findPlantTypeByName(
        createPostDto.plant.plantType,
      );
      if (!plantType) {
        throw new BadRequestException(
          `Plant type '${createPostDto.plant.plantType}' not found`,
        );
      }
      if (!plantType.species.includes(createPostDto.plant.species)) {
        throw new BadRequestException(
          `Species '${createPostDto.plant.species}' not found in plant type '${createPostDto.plant.plantType}'`,
        );
      }
      post.plant = await this.plantService.createPlant({
        ...createPostDto.plant,
        userId: currentUser._id,
      });
    }

    return post.save();
  }
}
