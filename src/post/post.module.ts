import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './model/Post';
import { PlantSchema } from './model/Plant';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { PlantService } from './service/plant.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: 'Plant', schema: PlantSchema },
    ]),
  ],
  controllers: [PostController],
  providers: [PostService, PlantService],
})
export class PostModule {}
