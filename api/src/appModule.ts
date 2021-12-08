import { Module } from '@nestjs/common';

import { UsersModule } from './users/index.js';

@Module({
    imports: [UsersModule],
})
export class AppModule {}
