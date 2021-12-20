import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { dbNames } from '../constants';
import { MoviesController, MoviesRepository, MoviesService, MovieSchema, MovieMongoDBRepository } from '.';
import { CastMemberMongoDBRepository, CastMemberSchema } from '../castMembers';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: dbNames.MOVIE, schema: MovieSchema }]),
        MongooseModule.forFeature([{ name: dbNames.CAST_MEMBER, schema: CastMemberSchema }]),
    ],
    controllers: [MoviesController],
    providers: [MoviesService, MovieMongoDBRepository, CastMemberMongoDBRepository],
})
export class MoviesModule {}
