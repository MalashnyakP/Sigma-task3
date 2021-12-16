import { ApiProperty } from '@nestjs/swagger';

export class UpdateCastMemberDto {
    @ApiProperty({ type: String, description: 'name' })
    name: string;

    @ApiProperty({ type: Number, description: 'role' })
    role: number;

    @ApiProperty({ type: Number, description: 'age' })
    age: number;
}

export class CastMemberDto extends UpdateCastMemberDto {
    @ApiProperty({ type: String, description: 'id' })
    id: string;
}
