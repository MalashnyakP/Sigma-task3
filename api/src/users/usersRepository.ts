import { UserDto } from '.';

export class UserRepository {
    constructor(private users: UserDto[]) {
        this.users = users;
    }

    public addUser(user: UserDto) {
        this.users.push(user);
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
        const usersSelection = this.users.slice(offset, limit);
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
