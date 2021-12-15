import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { dbNames } from '../constants';
import {
    CastMemberMongoDBRepository,
    CastMemberSchema,
    CastMembersController,
    CastMembersService,
} from '.';

@Module({
    controllers: [CastMembersController],
    providers: [CastMembersService, CastMemberMongoDBRepository],
    imports: [
        MongooseModule.forFeature([
            { name: dbNames.CAST_MEMBER, schema: CastMemberSchema },
        ]),
    ],
})
export class CastMembersModule {}
