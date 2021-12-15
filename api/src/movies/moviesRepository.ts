import { Model } from 'mongoose';
import { MovieDto, UpdateMovieDto } from '.';

export interface IMovieRepository {
    addMovie(movie: MovieDto): MovieDto | Promise<MovieDto>;
    deleteMovie(id: string): void;
    getMovie(id: string): MovieDto | Promise<MovieDto>;
    getMovies(
        offset: number,
        limit: number,
    ): [MovieDto[], number] | Promise<[MovieDto[], number]>;
    updateMovie(
        id: string,
        movie: UpdateMovieDto,
    ): MovieDto | Promise<MovieDto>;
    checkIfMovieExists(id: string): boolean | Promise<boolean>;
}

export class MoviesRepository implements IMovieRepository {
    constructor(private movies: MovieDto[]) {}

    public addMovie(movie: MovieDto) {
        this.movies.push(movie);
        return movie;
    }

    public deleteMovie(id: string) {
        this.movies = this.movies.filter((movie) => {
            return movie.id !== id;
        });
    }

    public getMovie(id: string): MovieDto {
        return this.movies.find((movie) => {
            return movie.id === id;
        });
    }

    public getMovies(offset: number, limit: number): [MovieDto[], number] {
        const moviesSelection = this.movies.slice(offset, limit);
        return [moviesSelection, this.movies.length];
    }

    public updateMovie(id: string, movie: MovieDto): MovieDto {
        const movieToUpdate = this.getMovie(id);
        Object.keys(movie).forEach((key) => {
            movieToUpdate[key] = movie[key];
        });

        return movieToUpdate;
    }

    public checkIfMovieExists(id: string): boolean {
        const movie = this.getMovie(id);
        if (movie) return true;

        return false;
    }
}

export class MovieMongoDBRepository implements IMovieRepository {
    constructor(private readonly movieModel: Model<MovieDto>) {}

    async addMovie(movie: MovieDto): Promise<MovieDto> {
        const newMovie = await this.movieModel.create(movie);
        return newMovie;
    }

    async deleteMovie(id: string): Promise<void> {
        await this.movieModel.findByIdAndDelete(id);
    }

    async getMovie(id: string): Promise<MovieDto> {
        const movie = await this.movieModel.findById(id).exec();
        return movie;
    }

    async getMovies(
        offset: number,
        limit: number,
    ): Promise<[MovieDto[], number]> {
        const movies = await this.movieModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
        return [movies, movies.length];
    }

    async updateMovie(id: string, movie: UpdateMovieDto): Promise<MovieDto> {
        const updatedMovie = await this.movieModel.findByIdAndUpdate(
            { _id: id },
            movie,
            { new: true },
        );

        return updatedMovie;
    }

    async checkIfMovieExists(id: string): Promise<boolean> {
        const movie = await this.movieModel.findById(id).exec();
        if (movie) {
            return true;
        }
        return false;
    }
}
