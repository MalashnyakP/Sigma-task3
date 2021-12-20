import { UserDto } from '..';

export interface IUserRepository {
    addUser(user: UserDto): Promise<UserDto>;
    deleteUser(id: string): Promise<void>;
    getUser(id: string): Promise<UserDto>;
    getUsers(offset: number, limit: number): Promise<[UserDto[], number]>;
    updateUser(id: string, user: UserDto): Promise<UserDto>;
    checkIfUserExists(id: string): Promise<boolean>;
}
