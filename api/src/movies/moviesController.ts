import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Version,
} from '@nestjs/common';
import { MovieDto, MoviesService } from './index.js';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    findAll(@Query('offset') offset = 0, @Query('limit') limit = 15) {
        const [movies, count] = this.moviesService.getAllMovies(+offset, +limit);

        return {
            movies,
            limit: +limit,
            offset: +offset,
            count,
        };
    }

    @Get(':id')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    findById(@Param() param) {
        const movie: MovieDto = this.moviesService.getMovieById(param.id);
        return movie;
    }

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() movie: MovieDto) {
        const newMovie = this.moviesService.createMovie(movie);
        return newMovie;
    }

    @Put(':id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    updateUser(@Param() params, @Body() body) {
        const updatedMovie = this.moviesService.updateMovie(params.id, body);
        return updatedMovie;
    }

    @Delete(':id')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param() params) {
        this.moviesService.deleteMovie(params.id);
    }
}
