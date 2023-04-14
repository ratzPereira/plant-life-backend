import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PlantSpecies } from './PlantSpecies';

@Schema()
export class PlantType {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: String, ref: 'PlantSpecies' }] })
  species?: PlantSpecies[];
}

export type PlantTypeDocument = PlantType & Document;

export const PlantTypeSchema = SchemaFactory.createForClass(PlantType);
