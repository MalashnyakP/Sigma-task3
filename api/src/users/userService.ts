import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { UserDto, UsersGuard, UserRepository } from '.';
import { validateObject } from '../utils';
import { GenericGuard } from '../genericGuard';

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
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
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
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        user = value;
        this.userRepository.addUser(user);

        return user;
    }

    deleteUser(id: string) {
        const [value, error] = validateObject(GenericGuard.idValidator, { id });
        if (error) {
            throw new HttpException(error, HttpStatus.UNPROCESSABLE_ENTITY);
        }
        id = value.id;

        if (!this.userRepository.checkIfUserExists(id)) {
            return HttpStatus.NOT_FOUND;
        }
        this.userRepository.deleteUser(id);
        return HttpStatus.NO_CONTENT;
    }

    updateUser(id: string, newUser: UserDto) {
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

        return this.userRepository.updateUser(id, newUser);
    }
}
