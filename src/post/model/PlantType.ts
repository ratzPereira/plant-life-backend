import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PlantType {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String] })
  species?: string[];
}

export type PlantTypeDocument = PlantType & Document;

export const PlantTypeSchema = SchemaFactory.createForClass(PlantType);
