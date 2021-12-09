import { MovieDto } from '.';

export class MoviesRepository {
    constructor(private movies: MovieDto[]) {}

    public addMovie(movie: MovieDto) {
        this.movies.push(movie);
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
