import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Plant } from './Plant';
import { UserType } from '../types/UserType';
import { User } from '../../user/models/User';

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

  @Prop({ type: User })
  user: User;

  @Prop({
    type: Plant,
  })
  plant?: Plant;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
