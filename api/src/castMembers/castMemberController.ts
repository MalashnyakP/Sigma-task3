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
    Res,
    Version,
} from '@nestjs/common';
import { Responce } from 'express';

import { CastMemberDto, CastMembersService } from '.';

@Controller('cast')
export class CastMembersController {
    constructor(private readonly castMembersService: CastMembersService) {}

    @Get()
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('offset') offset = 0, @Query('limit') limit = 25) {
        const [castMembers, count] =
            await this.castMembersService.getAllCastMembers(+offset, +limit);

        return { castMembers, limit, offset, count };
    }

    @Get(':id')
    @Version('1')
    @HttpCode(HttpStatus.OK)
    async findById(@Param() param) {
        const castMember: CastMemberDto =
            await this.castMembersService.getCastMemberById(param.id);
        return castMember;
    }

    @Post()
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() castMember: CastMemberDto) {
        const newCastMember = await this.castMembersService.createCastMember(
            castMember,
        );
        return newCastMember;
    }

    @Put(':id')
    @Version('1')
    @HttpCode(HttpStatus.CREATED)
    async updateCastMember(@Param() params, @Body() body) {
        const updatedCastMember =
            await this.castMembersService.updateCastMember(params.id, body);
        return updatedCastMember;
    }

    @Delete(':id')
    @Version('1')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param() params, @Res() res: Responce) {
        const statusCode = await this.castMembersService.deleteCastMember(
            params.id,
        );
        res.status(statusCode).send();
    }
}
