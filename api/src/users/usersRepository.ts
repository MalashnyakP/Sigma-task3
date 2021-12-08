import { UserDto } from '.';

export class UserRepository {
    constructor(public users: UserDto[]) {
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

    public updateUser(id: string, user: UserDto): UserDto {
        const userToUpdate = this.getUser(id);
        Object.keys(user).forEach((key) => {
            userToUpdate[key] = user[key];
        });

        return this.getUser(id);
    }

    public checkIfUserExists(id: string): boolean {
        const user = this.getUser(id);
        if (user) return true;
        
        return false;
    }
}
