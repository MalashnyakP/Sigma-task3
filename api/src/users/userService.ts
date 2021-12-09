import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserDto, UsersGuard, UserRepository } from './index.js';
import { validateObject } from '../utils/index.js';
import { GenericGuard } from '../genericGuard.js';

@Injectable()
export class UsersService {
    constructor(private userRepository: UserRepository) {
        this.userRepository = new UserRepository([]);
    }

    getAllUsers(offset: number, limit: number): [UserDto[], number] {
        return this.userRepository.getUsers(offset, limit);
    }

    getUserById(id: string): UserDto {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }

        id = value.id;
        const user = this.userRepository.getUser(id);
        if (!user) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.NOT_FOUND,
            );
        }

        return user;
    }

    createUser(user: UserDto): UserDto {
        const [value, error] = validateObject(
            UsersGuard.createUserValidator,
            user,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        user = value;
        this.userRepository.addUser(user);

        return user;
    }

    deleteUser(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        id = value.id;

        if (!this.userRepository.checkIfUserExists(id)) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.BAD_REQUEST,
            );
        }
        this.userRepository.deleteUser(id);
    }

    updateUser(id: string, newUser: UserDto) {
        const [value, error] = validateObject(
            UsersGuard.updateUserValidator,
            newUser,
        );

        if (error) {
            throw new HttpException(error, HttpStatus.BAD_REQUEST);
        }
        if (!this.userRepository.checkIfUserExists(id)) {
            throw new HttpException(
                `No user with id: ${id} was found.`,
                HttpStatus.BAD_REQUEST,
            );
        }

        newUser = value;
        return this.userRepository.updateUser(id, newUser);
    }
}
