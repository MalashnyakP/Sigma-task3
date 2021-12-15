import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

import { dbNames, movieMaturityLevels } from '../constants';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    year: number;

    @Prop({
        required: true,
        default: movieMaturityLevels.PG,
        enum: Object.values(movieMaturityLevels),
    })
    maturityLevel: number;

    @Prop({ required: true })
    runtime: string;

    @Prop({ required: true })
    genre: number[];

    @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: dbNames.CAST_MEMBER })
    cast: Types.ObjectId[];

    @Prop({ required: true, type: [SchemaTypes.ObjectId], ref: dbNames.CAST_MEMBER })
    director: string[];

    @Prop({ required: true })
    logo: string;

    @Prop({ required: true })
    backgroundImg: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
