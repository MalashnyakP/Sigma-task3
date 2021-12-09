import { Module } from '@nestjs/common';

import { MoviesController, MoviesRepository, MoviesService } from '.';

@Module({
    controllers: [MoviesController],
    providers: [MoviesService, MoviesRepository],
})
export class MoviesModule {}
