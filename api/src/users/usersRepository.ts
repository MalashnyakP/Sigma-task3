import { Model } from 'mongoose';

import { UpdateUserDto, UserDto } from '.';

export interface IUserRepository {
    addUser(user: UserDto): UserDto | Promise<UserDto>;
    deleteUser(id: string): void;
    getUser(id: string): UserDto | Promise<UserDto>;
    getUsers(
        offset: number,
        limit: number,
    ): [UserDto[], number] | Promise<[UserDto[], number]>;
    updateUser(id: string, user: UserDto): UserDto | Promise<UserDto>;
    checkIfUserExists(id: string): boolean | Promise<boolean>;
}

export class UserInMemoryRepository implements IUserRepository {
    constructor(private users: UserDto[]) {}

    public addUser(user: UserDto) {
        this.users.push(user);
        return user;
    }

    public deleteUser(id: string) {
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });
    }

    public getUser(id: string): UserDto {
        return this.users.find((user) => {
            return user.id === id;
        });
    }

    public getUsers(offset: number, limit: number): [UserDto[], number] {
        if (this.users.length <= offset) {
            return [this.users, this.users.length];
        }
        const usersSelection = this.users.slice(offset, offset + limit);
        return [usersSelection, this.users.length];
    }

    public updateUser(id: string, user: UserDto): UserDto {
        const userToUpdate = this.getUser(id);
        Object.keys(user).forEach((key) => {
            userToUpdate[key] = user[key];
        });

        return userToUpdate;
    }

    public checkIfUserExists(id: string): boolean {
        const user = this.getUser(id);
        if (user) return true;
        return false;
    }
}

export class UserMongoDBRepository implements IUserRepository {
    constructor(private readonly userModel: Model<UserDto>) {}

    async addUser(user: UserDto): Promise<UserDto> {
        const newUser = await this.userModel.create(user);
        return newUser;
    }

    async deleteUser(id: string): Promise<void> {
        await this.userModel.findByIdAndDelete(id);
    }

    async getUser(id: string): Promise<UserDto> {
        const user = await this.userModel.findById(id).exec();
        return user;
    }

    async getUsers(
        offset: number,
        limit: number,
    ): Promise<[UserDto[], number]> {
        const users = await this.userModel
            .find()
            .skip(offset)
            .limit(limit)
            .exec();
        const count = await this.userModel.countDocuments().exec();
        return [users, count];
    }

    async updateUser(id: string, user: UpdateUserDto): Promise<UserDto> {
        const updatedUser = await this.userModel.findByIdAndUpdate(
            { _id: id },
            user,
            { new: true },
        );

        return updatedUser;
    }

    async checkIfUserExists(id: string): Promise<boolean> {
        const user = await this.userModel.findById(id).exec();
        if (user) {
            return true;
        }
        return false;
    }
}
