import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../model/Post';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create.post.dto';
import { User } from '../../user/models/User';
import { PlantService } from './plant.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly plantService: PlantService,
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
      post.plant = await this.plantService.createPlant({
        ...createPostDto.plant,
        userId: currentUser._id,
      });
    }

    return post.save();
  }
}
