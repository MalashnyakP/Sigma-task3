import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController, UsersService, UserMongoDBRepository } from '.';
import { UserSchema } from '.';
import { dbNames } from '../constants';
import { MovieMongoDBRepository, MovieSchema } from '../movies';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserMongoDBRepository, MovieMongoDBRepository],
    imports: [
        MongooseModule.forFeature([{ name: dbNames.USER, schema: UserSchema }]),
        MongooseModule.forFeature([{ name: dbNames.MOVIE, schema: MovieSchema }]),
    ],
})
export class UsersModule {}
