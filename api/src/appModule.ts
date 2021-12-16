import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CastMembersModule } from './castMembers';
import { MoviesModule } from './movies';
import { UsersModule } from './users';

@Module({
    imports: [
        MoviesModule,
        UsersModule,
        CastMembersModule,
        MongooseModule.forRoot('mongodb://localhost:27017/movie_streaming'),
    ],
})
export class AppModule {}
