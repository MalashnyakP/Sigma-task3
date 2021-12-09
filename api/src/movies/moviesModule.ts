import { Module } from '@nestjs/common';

import { MoviesController, MoviesRepository, MoviesService } from './index.js';

@Module({
    controllers: [MoviesController],
    providers: [MoviesService, MoviesRepository],
})
export class MoviesModule {}
