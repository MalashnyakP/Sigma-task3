export class WatchlistDto {
    title: string;
    movies: string[];

    public addMovie(movie: string) {
        this.movies.push(movie);
    }
}
