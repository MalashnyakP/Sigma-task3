import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    HttpCode,
    Query,
    Put,
    Delete,
    Version,
    HttpStatus,
    Res,
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
    findAll(@Query('offset') offset = 0, @Query('limit') limit = 25) {
        const [users, count] = this.usersService.getAllUsers(+offset, +limit);

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
    findById(@Param() param) {
        const user: UserDto = this.usersService.getUserById(param.id);
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
    create(@Body() user: UserDto) {
        const newUser = this.usersService.createUser(user);
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
    updateUser(@Param() params, @Body() body) {
        const updatedUser = this.usersService.updateUser(params.id, body);
        return updatedUser;
    }

    @Delete(':id')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiParam({ name: 'id' })
    @ApiNoContentResponse({ description: 'User deleted' })
    @ApiNotFoundResponse({ description: 'No user to delete' })
    @ApiUnprocessableEntityResponse({ description: 'Invalid id' })
    deleteUser(@Param() params, @Res() res: Responce) {
        const statusCode = this.usersService.deleteUser(params.id);
        res.status(statusCode).send();
    }
}
