import { Model, PipelineStage, Types } from 'mongoose';

import { IUserRepository } from '.';
import { UpdateUserDto, UserDto } from '..';
import { dbNames } from '../../constants';

export class UserMongoDBRepository implements IUserRepository {
    constructor(private readonly userModel: Model<UserDto>) {}

    async addUser(user: UserDto): Promise<UserDto> {
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    async deleteUser(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async getUser(id: string): Promise<UserDto> {
        const user = await this.userModel.findById(id).populate({ path: 'favorites' }).exec();
        return user;
    }

    async getUsers(offset: number, limit: number): Promise<[UserDto[], number]> {
        const users = await this.userModel.find().skip(offset).limit(limit).exec();
        const count = await this.userModel.countDocuments().exec();
        return [users, count];
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<UserDto> {
        const updatedUser = await this.userModel.findByIdAndUpdate({ _id: id }, user, { new: true });

        return updatedUser;
    }

    async createWatchlist(id: string, title: string) {
        const watchlist = await this.userModel
            .findOneAndUpdate(
                { _id: id },
                {
                    $addToSet: {
                        watchlists: { title },
                    },
                },
                { new: true },
            )
            .exec();

        return watchlist;
    }

    async removeWatchlist(id: string, title: string) {
        const watchlist = await this.userModel
            .findOneAndUpdate(
                { _id: id },
                {
                    $pull: { watchlists: { title } },
                },
                { new: true },
            )
            .exec();
        return watchlist;
    }

    async addMovieToWatchlist(user_id: string, movie_id: string, title: string) {
        const watchlist = await this.userModel
            .findOneAndUpdate(
                { _id: user_id, watchlists: { $elemMatch: { title } } },
                {
                    $addToSet: {
                        'watchlists.$.movies': movie_id,
                    },
                },
                { new: true },
            )
            .exec();

        return watchlist;
    }

    async removiMovieFromWatchlist(user_id: string, movie_id: string, title: string) {
        const watchlist = await this.userModel.findOneAndUpdate(
            {
                _id: user_id,
                watchlists: { $elemMatch: { title } },
            },
            {
                $pull: {
                    'watchlists.$.movies': movie_id,
                },
            },
            { new: true },
        );

        return watchlist;
    }

    async addMovieToFavorites(user_id: string, movie_id: string) {
        const favorites = await this.userModel.findOneAndUpdate({ _id: user_id }, { $addToSet: { favorites: movie_id } }, { new: true });

        return favorites;
    }

    async removeMovieFromFavorites(user_id: string, movie_id: string) {
        const favorites = await this.userModel.findOneAndUpdate({ _id: user_id }, { $pull: { favorites: movie_id } }, { new: true });

        return favorites;
    }

    async getFavoritesStatistics(id: string) {
        const stats = await this.userModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: dbNames.MOVIE,
                    localField: 'favorites',
                    foreignField: '_id',
                    as: 'favorites',
                },
            },
            { $unwind: '$favorites' },
            {
                $group: {
                    _id: {
                        maturityLevel: '$favorites.maturityLevel',
                        genre: '$favorites.genre',
                    },
                    countMatLvl: { $count: {} },
                },
            } as PipelineStage.Group,
            { $unwind: '$_id.genre' },
            {
                $group: {
                    _id: {
                        genre: '$_id.genre',
                    },
                    maturityLevels: {
                        $push: {
                            maturityLevel: '$_id.maturityLevel',
                            countMatLvl: '$countMatLvl',
                        },
                    },
                    genreCount: { $count: {} },
                },
            } as PipelineStage.Group,
            { $unwind: '$maturityLevels' },
            {
                $group: {
                    _id: {},
                    genres: {
                        $addToSet: {
                            genre: '$_id.genre',
                            genreCount: '$genreCount',
                        },
                    },
                    maturityLevels: {
                        $push: {
                            maturityLevel: '$maturityLevels.maturityLevel',
                            MaturityLevelCount: {
                                $sum: '$maturityLevels.countMatLvl',
                            },
                        },
                    },
                },
            },
        ]);

        const castStats = await this.userModel.aggregate([
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: dbNames.MOVIE,
                    localField: 'favorites',
                    foreignField: '_id',
                    as: 'favorites',
                },
            },
            { $unwind: '$favorites' },
            {
                $lookup: {
                    from: dbNames.CAST_MEMBER,
                    localField: 'favorites.cast',
                    foreignField: '_id',
                    as: 'favorites.cast',
                },
            },
            {
                $lookup: {
                    from: dbNames.CAST_MEMBER,
                    localField: 'favorites.director',
                    foreignField: '_id',
                    as: 'favorites.director',
                },
            },
            { $unwind: '$favorites.cast' },
            {
                $group: {
                    _id: {
                        actor: '$favorites.cast.name',
                        director: '$favorites.director.name',
                    },
                    actorCount: { $count: {} },
                },
            } as PipelineStage.Group,
            { $unwind: '$_id.director' },
            {
                $group: {
                    _id: {
                        director: '$_id.director',
                    },
                    actors: {
                        $push: { actor: '$_id.actor', count: '$actorCount' },
                    },
                    directorCount: { $count: {} },
                },
            } as PipelineStage.Group,
            { $unwind: '$actors' },
            {
                $group: {
                    _id: {},
                    actors: {
                        $push: {
                            actor: '$actors.actor',
                            count: '$actors.count',
                        },
                    },
                    directors: {
                        $addToSet: {
                            director: '$_id.director',
                            count: '$directorCount',
                        },
                    },
                },
            } as PipelineStage.Group,
        ]);

        return { stats, castStats };
    }

    async checkIfUserExists(id: string): Promise<boolean> {
        const user = await this.userModel.findById(id).exec();
        return !!user;
    }

    async checkIfEmailInUse(email: string): Promise<boolean> {
        const user = await this.userModel.find({ email }).exec();
        return !!user;
    }
}
