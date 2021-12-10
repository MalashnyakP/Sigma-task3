import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({type: String, description: 'name'})
    name: string;

    @ApiProperty({type: String, description: 'email'})
    email: string;

    @ApiProperty({type: String, description: 'password'})
    password: string;

    @ApiProperty({type: String, description: 'role'})
    role: string;
}

export class UserDto extends UpdateUserDto {
    @ApiProperty({type: String, description: 'id'})
    id: string;
}
