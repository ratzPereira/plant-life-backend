import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlantDocument = Plant & Document;

@Schema()
export class Plant {
  @Prop()
  name: string;

  @Prop()
  species: string;

  @Prop()
  age: number;

  @Prop()
  location: string;

  @Prop()
  userId: string;

  @Prop()
  plantType: string; // novo campo para o tipo de planta
}

export const PlantSchema = SchemaFactory.createForClass(Plant);
