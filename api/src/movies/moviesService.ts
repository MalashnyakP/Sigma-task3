import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MovieDto, MoviesGuard, MoviesRepository } from '.';
import { CastMemberDto, CastMemberMongoDBRepository } from '../castMembers';
import { castMembersRoles, dbNames } from '../constants';
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
        this.castMembersRepository = new CastMemberMongoDBRepository(
            castMembersModel,
        );
    }

    async getAllMovies(
        offset: number,
        limit: number,
    ): Promise<[MovieDto[], number]> {
        return await this.moviesRepository.getMovies(offset, limit);
    }

    async getMovieById(id: string): Promise<MovieDto> {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        id = value.id;
        const movie = await this.moviesRepository.getMovie(id);
        if (!movie) {
            throw new HttpException(
                `No movie with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return movie;
    }

    async createMovie(movie: MovieDto): Promise<MovieDto> {
        const [value, error] = validateObject(
            MoviesGuard.createMovieValidator,
            movie,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        movie = value;

        const { cast, director } = movie;
        await this.checkIfCastMembersExists(castMembersRoles.ACTOR, cast);
        await this.checkIfCastMembersExists(
            castMembersRoles.DIRECTOR,
            director,
        );

        const newMovie = await this.moviesRepository.addMovie(movie);
        return newMovie;
    }

    async deleteMovie(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        const movieExists = await this.moviesRepository.checkIfMovieExists(id);
        if (!movieExists) {
            return HttpStatus.NOT_FOUND;
        }
        await this.moviesRepository.deleteMovie(id);
        return HttpStatus.NO_CONTENT;
    }

    async updateMovie(id: string, newMovie: MovieDto) {
        let [value, error] = validateObject(
            MoviesGuard.updateMovieValidator,
            newMovie,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        newMovie = value;

        [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        const movieExists = await this.moviesRepository.checkIfMovieExists(id);
        if (!movieExists) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        const { cast, director } = newMovie;
        await this.checkIfCastMembersExists(castMembersRoles.ACTOR, cast);
        await this.checkIfCastMembersExists(
            castMembersRoles.DIRECTOR,
            director,
        );

        const updatedMovie = await this.moviesRepository.updateMovie(
            id,
            newMovie,
        );
        return updatedMovie;
    }

    private async checkIfCastMembersExists(
        role: number,
        castMembers: string[],
    ): Promise<void> {
        for (let i = 0; i < castMembers.length; ++i) {
            const castMember = await this.castMembersRepository.getCastMember(
                castMembers[i],
            );
            if (!castMember || castMember.role !== role) {
                throw new HttpException(
                    `Cast member with id: ${castMembers[i]} and role: ${role} doen't exist`,
                    HttpStatus.NOT_FOUND,
                );
            }
        }
    }
}
