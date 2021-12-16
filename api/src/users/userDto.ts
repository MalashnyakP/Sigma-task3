import { ApiProperty } from '@nestjs/swagger';
import { WatchlistDto } from './watchlists';

export class UpdateUserDto {
    @ApiProperty({ type: String, description: 'name' })
    name: string;

    @ApiProperty({ type: String, description: 'email' })
    email: string;

    @ApiProperty({ type: String, description: 'password' })
    password: string;

    @ApiProperty({ type: Number, description: 'role' })
    role: number;

    @ApiProperty({ type: Number, description: 'age' })
    age: number;

    @ApiProperty({ type: [String], description: 'favorites' })
    favorites?: string[];

    @ApiProperty({ type: [WatchlistDto], description: 'watchlist' })
    watchlists?: WatchlistDto[];
}

export class UserDto extends UpdateUserDto {
    @ApiProperty({ type: String, description: 'id' })
    id: string;
}
