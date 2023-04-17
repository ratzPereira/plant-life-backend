import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './model/Post';
import { PlantSchema } from './model/Plant';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { PlantService } from './service/plant.service';
import { UserModule } from '../user/user.module';
import { PlantController } from './controller/plant.controller';
import { PlantTypeSchema } from './model/PlantType';
import { PlantTypeService } from './service/plant.type.service';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: 'Plant', schema: PlantSchema },
      { name: 'PlantType', schema: PlantTypeSchema },
    ]),
  ],
  controllers: [PostController, PlantController],
  providers: [PostService, PlantService, PlantTypeService],
})
export class PostModule {}
