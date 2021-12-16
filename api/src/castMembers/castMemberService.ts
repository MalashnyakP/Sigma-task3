import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CastMemberDto, CastMemberGuard, CastMemberMongoDBRepository } from '.';
import { dbNames } from '../constants';
import { GenericGuard } from '../genericGuard';
import { validateObject } from '../utils';

@Injectable()
export class CastMembersService {
    private castMemberRepository: CastMemberMongoDBRepository;

    constructor(
        @InjectModel(dbNames.CAST_MEMBER)
        private readonly castMemberModel: Model<CastMemberDto>,
    ) {
        this.castMemberRepository = new CastMemberMongoDBRepository(
            castMemberModel,
        );
    }

    async getAllCastMembers(
        offset: number,
        limit: number,
    ): Promise<[CastMemberDto[], number]> {
        return await this.castMemberRepository.getCastMembers(offset, limit);
    }

    async getCastMemberById(id: string): Promise<CastMemberDto> {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        id = value.id;
        const castMember = await this.castMemberRepository.getCastMember(id);
        if (!castMember) {
            throw new HttpException(
                `No cast member with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return castMember;
    }

    async createCastMember(castMember: CastMemberDto): Promise<CastMemberDto> {
        const [value, error] = validateObject(
            CastMemberGuard.createCastMemberValidator,
            castMember,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        castMember = value;
        const newCastMember = await this.castMemberRepository.addCastMember(
            castMember,
        );

        return newCastMember;
    }

    async deleteCastMember(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        if (!this.castMemberRepository.checkIfCastMemberExists(id)) {
            return HttpStatus.NOT_FOUND;
        }
        await this.castMemberRepository.deleteCastMember(id);
        return HttpStatus.NO_CONTENT;
    }

    async updateCastMember(id: string, newCastMember: CastMemberDto) {
        let [value, error] = validateObject(
            CastMemberGuard.updateCastMemberValidator,
            newCastMember,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        newCastMember = value;

        [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        if (!this.castMemberRepository.checkIfCastMemberExists(id)) {
            throw new HttpException(
                `No cast member with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }
        const updatedCastMember =
            await this.castMemberRepository.updateCastMember(id, newCastMember);
        return updatedCastMember;
    }
}
