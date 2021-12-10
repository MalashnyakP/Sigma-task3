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
import {
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiParam,
    ApiQuery,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

import { MovieDto, UpdateMovieDto, MoviesService } from './index.js';

@Controller('movies')
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}

    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'Get filtered movies' })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    findAll(@Query('offset') offset = 0, @Query('limit') limit = 15) {
        const [movies, count] = this.moviesService.getAllMovies(
            +offset,
            +limit,
        );

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
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Get movie by id' })
    @ApiUnprocessableEntityResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'No movie with such id' })
    findById(@Param() param) {
        const movie: MovieDto = this.moviesService.getMovieById(param.id);
        return movie;
    }

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: MovieDto })
    @ApiCreatedResponse({ description: 'Create movie' })
    @ApiUnprocessableEntityResponse({
        description: 'Movie data failed validation',
    })
    create(@Body() movie: MovieDto) {
        const newMovie = this.moviesService.createMovie(movie);
        return newMovie;
    }

    @Put(':id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: UpdateMovieDto })
    @ApiParam({ name: 'id' })
    @ApiCreatedResponse({ description: 'Movie data updated' })
    @ApiUnprocessableEntityResponse({
        description: 'Invalid id or Movie data to update failed validation',
    })
    updateUser(@Param() params, @Body() body) {
        const updatedMovie = this.moviesService.updateMovie(params.id, body);
        return updatedMovie;
    }

    @Delete(':id')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'User deleted' })
    @ApiNotFoundResponse({ description: 'No movie to delete' })
    @ApiUnprocessableEntityResponse({ description: 'Invalid id' })
    deleteUser(@Param() params) {
        this.moviesService.deleteMovie(params.id);
    }
}
