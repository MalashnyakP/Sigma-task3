import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import {
    UserDto,
    UsersGuard,
    UserInMemoryRepository,
    UserMongoDBRepository,
} from '.';
import { validateObject } from '../utils';
import { GenericGuard } from '../genericGuard';
import { dbNames } from '../constants';

@Injectable()
export class UsersService {
    private userRepository: UserMongoDBRepository;

    constructor(
        @InjectModel(dbNames.USER) private readonly userModel: Model<UserDto>,
    ) {
        this.userRepository = new UserMongoDBRepository(userModel);
    }

    async getAllUsers(
        offset: number,
        limit: number,
    ): Promise<[UserDto[], number]> {
        return await this.userRepository.getUsers(offset, limit);
    }

    async getUserById(id: string): Promise<UserDto> {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }

        id = value.id;
        const user = await this.userRepository.getUser(id);
        if (!user) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    async createUser(user: UserDto): Promise<UserDto> {
        const [value, error] = validateObject(
            UsersGuard.createUserValidator,
            user,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user = value;
        const newUser = await this.userRepository.addUser(user);

        return newUser;
    }

    async deleteUser(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        if (!this.userRepository.checkIfUserExists(id)) {
            return HttpStatus.NOT_FOUND;
        }
        await this.userRepository.deleteUser(id);
        return HttpStatus.NO_CONTENT;
    }

    async updateUser(id: string, newUser: UserDto) {
        let [value, error] = validateObject(
            UsersGuard.updateUserValidator,
            newUser,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        newUser = value;

        [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        if (!this.userRepository.checkIfUserExists(id)) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }
        const updatedUser = await this.userRepository.updateUser(id, newUser);
        return updatedUser;
    }
}
