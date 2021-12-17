import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { UserDto, UsersGuard, UserInMemoryRepository, UserMongoDBRepository } from '.';
import { validateObject } from '../utils';
import { GenericGuard } from '../genericGuard';
import { dbNames } from '../constants';
import { MovieDto, MovieMongoDBRepository } from '../movies';

@Injectable()
export class UsersService {
    private userRepository: UserMongoDBRepository;
    private movieRepository: MovieMongoDBRepository;

    constructor(
        @InjectModel(dbNames.USER) private readonly userModel: Model<UserDto>,
        @InjectModel(dbNames.MOVIE)
        private readonly movieModel: Model<MovieDto>,
    ) {
        this.userRepository = new UserMongoDBRepository(userModel);
        this.movieRepository = new MovieMongoDBRepository(movieModel);
    }

    async getAllUsers(offset: number, limit: number): Promise<[UserDto[], number]> {
        return await this.userRepository.getUsers(offset, limit);
    }

    async getUserById(id: string): Promise<UserDto> {
        id = this.validateId(id);

        const user = await this.userRepository.getUser(id);
        if (!user) {
            throw new HttpException(`No user with id: ${id} was found.`, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    async createUser(user: UserDto): Promise<UserDto> {
        const [value, error] = validateObject(UsersGuard.createUserValidator, user);

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user = value;
        const { email } = value;
        await this.checkIfEmailInUse(email);

        const newUser = await this.userRepository.addUser(user);
        return newUser;
    }

    async deleteUser(id: string) {
        id = this.validateId(id);
        await this.checkIfUserExists(id);

        await this.userRepository.deleteUser(id);
        return HttpStatus.NO_CONTENT;
    }

    async updateUser(id: string, newUser: UserDto) {
        let [value, error] = validateObject(UsersGuard.updateUserValidator, newUser);

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        newUser = value;
        id = this.validateId(id);
        await this.checkIfUserExists(id);
        const { email } = value;
        if (email) await this.checkIfEmailInUse(email);

        const updatedUser = await this.userRepository.updateUser(id, newUser);
        return updatedUser;
    }

    async createWatchlist(id: string, name: string) {
        let [, error] = validateObject(UsersGuard.updateUserValidator, {
            watchlists: [{ title: name }],
        });

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        name.trim();

        id = this.validateId(id);
        await this.checkIfUserExists(id);

        const watchlists = await this.userRepository.createWatchlist(id, name);
        return watchlists;
    }

    async removeWatchlist(id: string, title: string) {
        id = this.validateId(id);
        await this.checkIfUserExists(id);

        const watchlist = await this.userRepository.removeWatchlist(id, title);
        return watchlist;
    }

    async addMovieToWatchlist(user_id: string, movie_id: string, title: string) {
        user_id = this.validateId(user_id);
        await this.checkIfUserExists(user_id);
        movie_id = this.validateId(movie_id);
        await this.checkIFMovieExists(movie_id);

        return await this.userRepository.addMovieToWatchlist(user_id, movie_id, title);
    }

    async removeMovieFromWatchlist(user_id: string, movie_id: string, title: string) {
        user_id = this.validateId(user_id);
        await this.checkIfUserExists(user_id);
        movie_id = this.validateId(movie_id);
        await this.checkIFMovieExists(movie_id);

        return await this.userRepository.removiMovieFromWatchlist(user_id, movie_id, title);
    }

    async addMovieToFavorites(user_id: string, movie_id: string) {
        user_id = this.validateId(user_id);
        await this.checkIfUserExists(user_id);
        movie_id = this.validateId(movie_id);
        await this.checkIFMovieExists(movie_id);

        const favorite = await this.userRepository.addMovieToFavorites(user_id, movie_id);
        return favorite;
    }

    async removeMovieFromFavorites(user_id: string, movie_id: string) {
        user_id = this.validateId(user_id);
        await this.checkIfUserExists(user_id);
        movie_id = this.validateId(movie_id);
        await this.checkIFMovieExists(movie_id);
        const favorite = await this.userRepository.removeMovieFromFavorites(user_id, movie_id);
        return favorite;
    }

    async getFavoritesStats(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;
        await this.checkIfUserExists(id);

        const stats = await this.userRepository.getFavoritesStatistics(id);
        return stats;
    }

    private validateId(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, {
            id,
        });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return value.id;
    }

    private async checkIfUserExists(id: string) {
        const userCheck = await this.userRepository.checkIfUserExists(id);
        if (!userCheck) {
            throw new HttpException(`No user with id: ${id} was found.`, HttpStatus.NOT_FOUND);
        }
    }

    private async checkIFMovieExists(id: string) {
        const movieCheck = await this.movieRepository.checkIfMovieExists(id);
        if (!movieCheck) {
            throw new HttpException(`No movie with id: ${id} was found.`, HttpStatus.NOT_FOUND);
        }
    }

    private async checkIfEmailInUse(email: string) {
        const userCheck = await this.userRepository.checkIfEmailInUse(email);
        if (userCheck) {
            throw new HttpException(`Email: ${email} is already in use.`, HttpStatus.BAD_REQUEST);
        }
    }
}
