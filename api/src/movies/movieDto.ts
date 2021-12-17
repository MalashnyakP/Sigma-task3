import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
    @ApiProperty({ type: String, description: 'title' })
    title: string;

    @ApiProperty({ type: String, description: 'decription' })
    description: string;

    @ApiProperty({ type: Number, description: 'year' })
    year: number;

    @ApiProperty({ type: Number, description: 'maturity level' })
    maturityLevel: number;

    @ApiProperty({ type: String, description: 'runtime' })
    runtime: string;

    @ApiProperty({ type: Number, description: 'genre' })
    genre: number[];

    @ApiProperty({ type: String, description: 'cast' })
    cast: string[];

    @ApiProperty({ type: String, description: 'director' })
    director: string[];

    @ApiProperty({ type: String, description: 'logo' })
    poster: string;

    @ApiProperty({ type: String, description: 'backgrounf image' })
    backgroundImg: string;
}

export class MovieDto extends UpdateMovieDto {
    @ApiProperty({ type: String, description: 'id' })
    id: string;
}
