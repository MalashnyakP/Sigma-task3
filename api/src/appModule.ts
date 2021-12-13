import { Module } from '@nestjs/common';

import { MoviesModule } from './movies';
import { UsersModule } from './users';

@Module({
    imports: [MoviesModule, UsersModule],
})
export class AppModule {}
