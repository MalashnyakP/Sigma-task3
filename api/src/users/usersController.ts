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
} from '@nestjs/common';

import { UserDto, UsersService } from './index.js';

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
    @HttpCode(HttpStatus.NO_CONTENT)
    deleteUser(@Param() params) {
        this.usersService.deleteUser(params.id);
    }
}
