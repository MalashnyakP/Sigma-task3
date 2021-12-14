import { ApiProperty } from '@nestjs/swagger';

export class UpdateMovieDto {
    @ApiProperty({ type: String, description: 'title' })
    title: string;

    @ApiProperty({ type: String, description: 'decription' })
    description: string;

    @ApiProperty({ type: Number, description: 'year' })
    year: number;

    @ApiProperty({ type: String, description: 'maturoty level' })
    maturityLevel: string;

    @ApiProperty({ type: String, description: 'runtime' })
    runtime: string;

    @ApiProperty({ type: String, description: 'genre' })
    genre: string;

    @ApiProperty({ type: String, description: 'cast' })
    cast: string[];

    @ApiProperty({ type: String, description: 'director' })
    director: string;

    @ApiProperty({ type: String, description: 'logo' })
    logo: string;

    @ApiProperty({ type: String, description: 'backgrounf image' })
    backgroundImg: string;
}

export class MovieDto extends UpdateMovieDto {
    @ApiProperty({ type: String, description: 'id' })
    id: string;
}
