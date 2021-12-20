import { Model } from 'mongoose';

import { MovieDto, UpdateMovieDto } from '.';
import { dbNames, movieMaturityLevels } from '../constants';

export interface IMovieRepository {
    addMovie(movie: MovieDto): Promise<MovieDto>;
    deleteMovie(id: string): Promise<void>;
    getMovie(id: string): Promise<MovieDto>;
    getMovies(offset: number, limit: number, userAge: number): Promise<[MovieDto[], number]>;
    updateMovie(id: string, movie: UpdateMovieDto): Promise<MovieDto>;
    checkIfMovieExists(id: string): Promise<boolean>;
}

export class MoviesRepository implements IMovieRepository {
    constructor(private movies: MovieDto[]) {}

    public async addMovie(movie: MovieDto): Promise<MovieDto> {
        this.movies.push(movie);
        return movie;
    }

    public async deleteMovie(id: string): Promise<void> {
        this.movies = this.movies.filter((movie) => {
            return movie.id !== id;
        });
    }

    public async getMovie(id: string): Promise<MovieDto> {
        return this.movies.find((movie) => {
            return movie.id === id;
        });
    }

    public async getMovies(offset: number, limit: number): Promise<[MovieDto[], number]> {
        const moviesSelection = this.movies.slice(offset, limit);
        return [moviesSelection, this.movies.length];
    }

    public async updateMovie(id: string, movie: MovieDto): Promise<MovieDto> {
        const movieToUpdate = this.getMovie(id);
        Object.keys(movie).forEach((key) => {
            movieToUpdate[key] = movie[key];
        });

        return movieToUpdate;
    }

    public async checkIfMovieExists(id: string): Promise<boolean> {
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

    async getMovies(offset: number, limit: number, userAge: number): Promise<[MovieDto[], number]> {
        const ageFilter = this.filterByAge(userAge);

        const movies = await this.movieModel
            .aggregate([
                { $match: { maturityLevel: { $lte: ageFilter } } },
                { $skip: offset },
                { $limit: limit },
                {
                    $lookup: {
                        from: dbNames.CAST_MEMBER,
                        localField: 'cast',
                        foreignField: '_id',
                        as: 'cast',
                        pipeline: [
                            {
                                $project: {
                                    role: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    __v: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $lookup: {
                        from: dbNames.CAST_MEMBER,
                        localField: 'director',
                        foreignField: '_id',
                        as: 'director',
                        pipeline: [
                            {
                                $project: {
                                    role: 0,
                                    createdAt: 0,
                                    updatedAt: 0,
                                    __v: 0,
                                },
                            },
                        ],
                    },
                },
                {
                    $project: {
                        backgroundImg: 0,
                        description: 0,
                        createdAt: 0,
                        updatedAt: 0,
                        __v: 0,
                    },
                },
            ])
            .exec();

        const count = await this.movieModel.find().countDocuments().exec();
        return [movies, count];
    }

    async updateMovie(id: string, movie: UpdateMovieDto): Promise<MovieDto> {
        const updatedMovie = await this.movieModel.findByIdAndUpdate({ _id: id }, movie, { new: true });

        return updatedMovie;
    }

    async checkIfMovieExists(id: string): Promise<boolean> {
        const movie = await this.movieModel.findById(id).exec();
        if (movie) {
            return true;
        }
        return false;
    }

    private filterByAge(age: number) {
        let ageFilter = movieMaturityLevels.EIGHTTEEN_PLUS;
        if (age >= 16 && age < 18) {
            ageFilter = movieMaturityLevels.SIXTEEN_PLUS;
        } else if (age >= 13 && age < 16) {
            ageFilter = movieMaturityLevels.THIRTEEN_PLUS;
        } else if (age >= 7 && age < 13) {
            ageFilter = movieMaturityLevels.SEVEN_PLUS;
        } else if (age < 7) {
            ageFilter = movieMaturityLevels.ALL;
        }
        return ageFilter;
    }
}
