import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
    IUserRepository,
    UsersController,
    UsersService,
    UserInMemoryRepository,
    UserMongoDBRepository,
} from '.';
import { UserSchema } from '.';
import { dbNames } from '../constants';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserMongoDBRepository],
    imports: [
        MongooseModule.forFeature([{ name: dbNames.USER, schema: UserSchema }]),
    ],
})
export class UsersModule {}
