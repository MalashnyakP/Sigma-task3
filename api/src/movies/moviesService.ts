import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MovieDto, MoviesGuard, MoviesRepository } from './index.js';
import { GenericGuard } from '../genericGuard.js';
import { validateObject } from '../utils/index.js';

@Injectable()
export class MoviesService {
    constructor(private moviesRepository: MoviesRepository) {
        this.moviesRepository = new MoviesRepository([]);
    }

    getAllMovies(offset: number, limit: number): [MovieDto[], number] {
        return this.moviesRepository.getMovies(offset, limit);
    }

    getMovieById(id: string): MovieDto {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }

        id = value.id;
        const movie = this.moviesRepository.getMovie(id);
        if (!movie) {
            throw new HttpException(
                `No movie with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return movie;
    }

    createMovie(movie: MovieDto): MovieDto {
        const [value, error] = validateObject(
            MoviesGuard.createMovieValidator,
            movie,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        movie = value;
        this.moviesRepository.addMovie(movie);

        return movie;
    }

    deleteMovie(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        id = value.id;

        if (!this.moviesRepository.checkIfMovieExists(id)) {
            throw new HttpException(
                `No movie with id: ${id} was found.`,
                HttpStatus.BAD_REQUEST,
            );
        }
        this.moviesRepository.deleteMovie(id);
    }

    updateMovie(id: string, newMovie: MovieDto) {
        let [value, error] = validateObject(
            MoviesGuard.updateMovieValidator,
            newMovie,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        newMovie = value;

        [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        id = value.id;

        if (!this.moviesRepository.checkIfMovieExists(id)) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.BAD_REQUEST,
            );
        }

        return this.moviesRepository.updateMovie(id, newMovie);
    }
}
