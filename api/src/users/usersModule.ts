import { Module } from '@nestjs/common';

import { UsersController, UsersService, UserRepository } from './index.js';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
})
export class UsersModule {}
