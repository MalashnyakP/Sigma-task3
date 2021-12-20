import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { castMembersRoles } from '../constants';

export type CastMemberDocument = CastMember & Document;

@Schema({ timestamps: true })
export class CastMember {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    age: number;

    @Prop({
        require: true,
        enum: Object.values(castMembersRoles),
        type: [Number],
    })
    role: number[];
}

export const CastMemberSchema = SchemaFactory.createForClass(CastMember);
