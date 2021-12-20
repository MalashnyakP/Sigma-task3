import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

import { dbNames, movieMaturityLevels } from '../constants';

export type MovieDocument = Movie & Document;

@Schema({ timestamps: true })
export class Movie {
    @Prop({ required: true, index: true })
    title: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true, index: true })
    year: number;

    @Prop({
        required: true,
        default: movieMaturityLevels.ALL,
        enum: Object.values(movieMaturityLevels),
        index: true,
    })
    maturityLevel: number;

    @Prop({ required: true, index: true })
    runtime: string;

    @Prop({ required: true, type: [Number], unique: true })
    genre: number[];

    @Prop({
        required: true,
        type: [SchemaTypes.ObjectId],
        ref: dbNames.CAST_MEMBER,
    })
    cast: Types.ObjectId[];

    @Prop({
        required: true,
        type: [SchemaTypes.ObjectId],
        ref: dbNames.CAST_MEMBER,
    })
    director: Types.ObjectId[];

    @Prop({ required: true, index: true })
    poster: string;

    @Prop({ required: true })
    backgroundImg: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
