import { Model } from 'mongoose';

import { CastMemberDto } from '.';

export interface ICastMemberRepository {
    addCastMember(
        castMember: CastMemberDto,
    ): CastMemberDto | Promise<CastMemberDto>;
    deleteCastMember(id: string): void;
    getCastMember(id: string): CastMemberDto | Promise<CastMemberDto>;
    getCastMembers(
        offset: number,
        limit: number,
    ): [CastMemberDto[], number] | Promise<[CastMemberDto[], number]>;
    updateCastMember(
        id: string,
        castMember: CastMemberDto,
    ): CastMemberDto | Promise<CastMemberDto>;
    checkIfCastMemberExists(id: string): boolean | Promise<boolean>;
}

export class CastMemberMongoDBRepository implements ICastMemberRepository {
    constructor(private readonly castMemberModel: Model<CastMemberDto>) {}

    async addCastMember(castMember: CastMemberDto): Promise<CastMemberDto> {
        const newCastMember = await this.castMemberModel.create(castMember);
        return newCastMember;
    }

    async deleteCastMember(id: string): Promise<void> {
        await this.castMemberModel.findByIdAndDelete(id);
    }

    async getCastMember(id: string): Promise<CastMemberDto> {
        const castMember = await this.castMemberModel.findById(id).exec();
        return castMember;
    }

    async getCastMembers(
        offset: number,
        limit: number,
    ): Promise<[CastMemberDto[], number]> {
        const castMembers = await this.castMemberModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
        const count = await this.castMemberModel.countDocuments().exec();
        return [castMembers, count];
    }

    async updateCastMember(
        id: string,
        castMember: CastMemberDto,
    ): Promise<CastMemberDto> {
        const updatedCastMember = await this.castMemberModel.findByIdAndUpdate(
            { _id: id },
            castMember,
            { new: true },
        );

        return updatedCastMember;
    }

    async checkIfCastMemberExists(id: string): Promise<boolean> {
        const castMember = await this.castMemberModel.findById(id).exec();
        if (castMember) {
            return true;
        }
        return false;
    }
}
