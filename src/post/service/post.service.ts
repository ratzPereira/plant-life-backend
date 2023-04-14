import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from '../model/Post';
import { Model } from 'mongoose';
import { CreatePostDto } from '../dto/create.post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const createdPost = new this.postModel(createPostDto);
    return createdPost.save();
  }
}
