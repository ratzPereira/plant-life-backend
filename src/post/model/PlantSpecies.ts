import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PlantType } from './PlantType';

@Schema()
export class PlantSpecies {
  @Prop({ required: true })
  name: string;

  @Prop({ type: String, ref: 'PlantType' })
  type: PlantType;
}

export type PlantSpeciesDocument = PlantSpecies & Document;

export const PlantSpeciesSchema = SchemaFactory.createForClass(PlantSpecies);
