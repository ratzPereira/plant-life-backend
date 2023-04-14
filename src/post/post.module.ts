import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './model/Post';
import { PlantSchema } from './model/Plant';
import { PostController } from './controller/post.controller';
import { PostService } from './service/post.service';
import { PlantService } from './service/plant.service';
import { UserModule } from '../user/user.module';
import { PlantController } from './controller/plant.controller';
import { PlantSpeciesSchema } from './model/PlantSpecies';
import { PlantTypeSchema } from './model/PlantType';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: 'Plant', schema: PlantSchema },
      { name: 'PlantType', schema: PlantTypeSchema },
      { name: 'PlantSpecies', schema: PlantSpeciesSchema },
    ]),
  ],
  controllers: [PostController, PlantController],
  providers: [PostService, PlantService],
})
export class PostModule {}
