import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../model/Post';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create.post.dto';
import { User } from '../../user/models/User';
import { PlantService } from './plant.service';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    private readonly plantService: PlantService,
    private readonly userService: UserService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    currentUser: User,
  ): Promise<Post> {
    console.log(currentUser);
    const createdPost = new this.postModel({
      ...createPostDto,
      user: currentUser,
    });

    createdPost.plant = await this.plantService.createPlant({
      ...createPostDto.plant,
      userId: currentUser._id,
    });

    return createdPost.save();
  }
}
