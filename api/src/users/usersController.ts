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
import { Responce } from 'express';

import { UserDto, UsersService } from '.';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
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
    findById(@Param() param) {
        const user: UserDto = this.usersService.getUserById(param.id);
        return user;
    }

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() user: UserDto) {
        const newUser = this.usersService.createUser(user);
        return newUser;
    }

    @Put(':id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    updateUser(@Param() params, @Body() body) {
        const updatedUser = this.usersService.updateUser(params.id, body);
        return updatedUser;
    }

    @Delete(':id')
    @Version('1')
    deleteUser(@Param() params, @Res() res: Responce) {
        const statusCode = this.usersService.deleteUser(params.id);
        res.status(statusCode).send();
    }
}
