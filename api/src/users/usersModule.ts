import { Module } from '@nestjs/common';

import { UsersController, UsersService } from './index.js';
import { UserRepository } from './usersRepository.js';

@Module({
    controllers: [UsersController],
    providers: [UsersService, UserRepository],
})
export class UsersModule {}
