import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Types, Document, SchemaTypes } from 'mongoose';

import { dbNames, userRoles } from '../constants';
import { WatchlistDto } from '../watchlists';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true, index: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({
        required: true,
        default: userRoles.USER,
        enum: Object.values(userRoles),
    })
    role: number;

    @Prop({ required: true })
    age: number;

    @Prop({ type: [SchemaTypes.ObjectId], ref: dbNames.MOVIE })
    favorites: Types.ObjectId[];

    @Prop({ type: [SchemaTypes.Mixed] })
    watchlists: WatchlistDto[];
}

export const UserSchema = SchemaFactory.createForClass(User);
