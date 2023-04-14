import { Body, Controller, Post } from '@nestjs/common';
import { CreatePostDto } from '../dto/create.post.dto';
import { PostService } from '../service/post.service';

@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(createPostDto);
  }
}
