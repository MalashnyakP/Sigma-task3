import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { string } from 'joi';
import { Model } from 'mongoose';

import { MovieDto, MoviesGuard, MoviesRepository } from '.';
import { CastMemberDto, CastMemberMongoDBRepository } from '../castMembers';
import { dbNames } from '../constants';
import { GenericGuard } from '../genericGuard';
import { validateObject } from '../utils';
import { MovieMongoDBRepository } from './moviesRepository';

@Injectable()
export class MoviesService {
    private moviesRepository: MovieMongoDBRepository;
    private castMembersRepository: CastMemberMongoDBRepository;
    constructor(
        @InjectModel(dbNames.MOVIE)
        private readonly moviesModel: Model<MovieDto>,
        @InjectModel(dbNames.CAST_MEMBER)
        private readonly castMembersModel: Model<CastMemberDto>,
    ) {
        this.moviesRepository = new MovieMongoDBRepository(moviesModel);
        this.castMembersRepository = new CastMemberMongoDBRepository(castMembersModel);
    }

    async getAllMovies(offset: number, limit: number, userAge: number): Promise<[MovieDto[], number]> {
        return await this.moviesRepository.getMovies(offset, limit, userAge);
    }

    async getMovieById(id: string): Promise<MovieDto> {
        id = this.validateId(id);

        const movie = await this.moviesRepository.getMovie(id);
        if (!movie) {
            throw new HttpException(`No movie with id: ${id} was found.`, HttpStatus.NOT_FOUND);
        }

        return movie;
    }

    async createMovie(movie: MovieDto): Promise<MovieDto> {
        const [value, error] = validateObject(MoviesGuard.createMovieValidator, movie);

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        movie = value;

        const { cast, director } = movie;
        movie.cast = await this.createCastMembersIfNone(cast);
        movie.director = await this.createCastMembersIfNone(director);

        const newMovie = await this.moviesRepository.addMovie(movie);
        return newMovie;
    }

    async deleteMovie(id: string) {
        id = this.validateId(id);

        const movieExists = await this.moviesRepository.checkIfMovieExists(id);
        if (!movieExists) {
            return HttpStatus.NOT_FOUND;
        }
        await this.moviesRepository.deleteMovie(id);
        return HttpStatus.NO_CONTENT;
    }

    async updateMovie(id: string, newMovie: MovieDto) {
        let [value, error] = validateObject(MoviesGuard.updateMovieValidator, newMovie);

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        newMovie = value;

        id = this.validateId(id);

        const movieExists = await this.moviesRepository.checkIfMovieExists(id);
        if (!movieExists) {
            throw new HttpException(`No movie with id: ${id} was found.`, HttpStatus.NOT_FOUND);
        }

        const { cast, director } = newMovie;
        if (cast) {
            newMovie.cast = await this.createCastMembersIfNone(cast);
        }
        if (director) {
            newMovie.director = await this.createCastMembersIfNone(director);
        }

        const updatedMovie = await this.moviesRepository.updateMovie(id, newMovie);
        return updatedMovie;
    }

    private async checkIfCastMembersExists(castMembers: string[]): Promise<void> {
        for (let i = 0; i < castMembers.length; ++i) {
            const exists = await this.castMembersRepository.checkIfCastMemberExists(castMembers[i]);
            if (!exists) {
                throw new HttpException(`Cast member with id: ${castMembers[i]} doesn't exist`, HttpStatus.NOT_FOUND);
            }
        }
    }

    private async createCastMembersIfNone(castMembers: string[]) {
        if (castMembers.every((item) => typeof item === 'string')) {
            await this.checkIfCastMembersExists(castMembers);
        } else {
            const castDto = castMembers as unknown as CastMemberDto;
            for (let i = 0; i < castMembers.length; ++i) {
                const { id } = await this.castMembersRepository.addCastMember(castDto[i]);
                castMembers[i] = id;
            }
        }

        return castMembers;
    }

    private validateId(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        return value.id;
    }
}
