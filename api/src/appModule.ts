import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { utils } from './constants';

import { MoviesModule } from './movies';
import { UsersModule } from './users';

@Module({
    imports: [MoviesModule, UsersModule, MongooseModule.forRoot(utils.MONGO_DB_URL)],
})
export class AppModule {}
