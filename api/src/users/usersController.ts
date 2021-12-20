import { Controller, Get, Post, Body, Param, HttpCode, Query, Put, Delete, Version, HttpStatus, Res } from '@nestjs/common';
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
import { Responce } from 'express';

import { UserDto, UpdateUserDto, UsersService } from '.';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'Get filtered users' })
    @ApiQuery({ name: 'offset', required: false })
    @ApiQuery({ name: 'limit', required: false })
    async findAll(@Query('offset') offset = 0, @Query('limit') limit = 25) {
        const [users, count] = await this.usersService.getAllUsers(+offset, +limit);

        return {
            users,
            limit: +limit,
            offset: +offset,
            count,
        };
    }

    @Get(':id')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    @ApiParam({ name: 'id' })
    @ApiOkResponse({ description: 'Get user by id' })
    @ApiUnprocessableEntityResponse({ description: 'Invalid id' })
    @ApiNotFoundResponse({ description: 'No user with such id' })
    async findById(@Param() param) {
        const user: UserDto = await this.usersService.getUserById(param.id);
        return user;
    }

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: UserDto })
    @ApiCreatedResponse({ description: 'Create user' })
    @ApiUnprocessableEntityResponse({
        description: 'User data failed validation',
    })
    async create(@Body() user: UserDto) {
        const newUser = await this.usersService.createUser(user);
        return newUser;
    }

    @Put(':id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    @ApiBody({ type: UpdateUserDto })
    @ApiParam({ name: 'id' })
    @ApiCreatedResponse({ description: 'User data updated' })
    @ApiUnprocessableEntityResponse({
        description: 'Invalid id or User data to update failed validation',
    })
    async updateUser(@Param() params, @Body() body) {
        const updatedUser = await this.usersService.updateUser(params.id, body);
        return updatedUser;
    }

    @Delete(':id')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'User deleted' })
    @ApiNotFoundResponse({ description: 'No user to delete' })
    @ApiUnprocessableEntityResponse({ description: 'Invalid id' })
    async deleteUser(@Param() params, @Res() res: Responce) {
        const statusCode = await this.usersService.deleteUser(params.id);
        res.status(statusCode).send();
    }

    @Put(':id/watchlists')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async createWatchlist(@Param() param, @Body() body) {
        const { id } = param;
        const { name } = body;
        const watchlists = await this.usersService.createWatchlist(id, name);
        return watchlists;
    }

    @Put(':id/watchlists/remove')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async removeWatchlist(@Param() param, @Body() body) {
        const { id } = param;
        const { title } = body;
        const watchlists = await this.usersService.removeWatchlist(id, title);
        return watchlists;
    }

    @Put(':id/watchlists/:movie_id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async addMovieToWatchlist(@Param() param, @Body() body) {
        const { id, movie_id } = param;
        const { title } = body;
        return await this.usersService.addMovieToWatchlist(id, movie_id, title);
    }

    @Put(':id/watchlists/remove/:movie_id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async removeMovieFromWatchlist(@Param() param, @Body() body) {
        const { id, movie_id } = param;
        const { title } = body;
        return await this.usersService.removeMovieFromWatchlist(id, movie_id, title);
    }

    @Put(':id/favorites/:movie_id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async addMovieToFavorites(@Param() param) {
        const { id, movie_id } = param;
        const favorites = await this.usersService.addMovieToFavorites(id, movie_id);
        return favorites;
    }

    @Put(':id/favorites/remove/:movie_id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async removeMovieFromFavorites(@Param() param) {
        const { id, movie_id } = param;
        const favorites = await this.usersService.removeMovieFromFavorites(id, movie_id);
        return favorites;
    }

    @Get(':id/favorites')
    @Version('1')
    async getFavoritesStats(@Param() param) {
        const { id } = param;
        const stats = await this.usersService.getFavoritesStats(id);
        return stats;
    }
}
