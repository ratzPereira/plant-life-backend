import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './model/Post';
import { PlantSchema } from './model/Plant';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: 'Plant', schema: PlantSchema },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class PostModule {}
