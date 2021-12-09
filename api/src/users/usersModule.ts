import { Module } from '@nestjs/common';

import { UsersController, UsersService, UserRepository } from '.';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
})
export class UsersModule {}
