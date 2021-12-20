import { IUserRepository } from '.';
import { UserDto } from '..';

export class UserInMemoryRepository implements IUserRepository {
    constructor(private users: UserDto[]) {}

    public async addUser(user: UserDto): Promise<UserDto> {
        this.users.push(user);
        return user;
    }

    public async deleteUser(id: string) {
        this.users = this.users.filter((user) => {
            return user.id !== id;
        });
    }

    public async getUser(id: string): Promise<UserDto> {
        const user = this.users.find((user) => {
            return user.id === id;
        });
        return user;
    }

    public async getUsers(offset: number, limit: number): Promise<[UserDto[], number]> {
        if (this.users.length <= offset) {
            return [this.users, this.users.length];
        }
        const usersSelection = this.users.slice(offset, offset + limit);
        return [usersSelection, this.users.length];
    }

    public async updateUser(id: string, user: UserDto): Promise<UserDto> {
        const userToUpdate = this.getUser(id);
        Object.keys(user).forEach((key) => {
            userToUpdate[key] = user[key];
        });

        return userToUpdate;
    }

    public async checkIfUserExists(id: string): Promise<boolean> {
        const user = this.getUser(id);
        if (user) return true;
        return false;
    }
}
