import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/index.js';

import { UsersModule } from './users/index.js';

@Module({
    imports: [MoviesModule, UsersModule],
})
export class AppModule {}
