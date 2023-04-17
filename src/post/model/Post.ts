import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Plant } from './Plant';
import { UserType } from '../types/UserType';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop()
  image?: string[];

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ type: UserType, required: true, select: false })
  user: UserType;

  @Prop({
    type: Plant,
  })
  plant?: Plant;
}

export const PostSchema = SchemaFactory.createForClass(Post);
