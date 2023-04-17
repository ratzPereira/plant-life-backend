import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreatePostDto } from '../dto/create.post.dto';
import { PostService } from '../service/post.service';
import { UserDecorator } from '../../user/decorator/user.decorator';
import { User } from '../../user/models/User';

@Controller('/api/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  async createPost(
    @Body(new ValidationPipe()) createPostDto: CreatePostDto,
    @UserDecorator() currentUser: User,
  ) {
    return await this.postService.createPost(createPostDto, currentUser);
  }
}
