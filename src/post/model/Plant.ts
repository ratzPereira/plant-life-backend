import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlantDocument = Plant & Document;

@Schema()
export class Plant {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  species: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  image: string[];

  @Prop({ required: true })
  userId: string;
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
