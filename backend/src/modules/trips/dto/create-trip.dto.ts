import { IsString, IsNumber, IsBoolean, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTripDto {
  @ApiProperty({ example: 'Cape Town' })
  @IsString()
  departureCity: string;

  @ApiProperty({ example: 'Cape Town Station, Adderley Street' })
  @IsString()
  departureLocation: string;

  @ApiProperty({ example: 'Johannesburg' })
  @IsString()
  destinationCity: string;

  @ApiProperty({ example: 'Park Station, Johannesburg' })
  @IsString()
  destinationLocation: string;

  @ApiProperty({ example: '2024-12-25' })
  @IsDateString()
  departureDate: string;

  @ApiProperty({ example: '08:00' })
  @IsString()
  departureTime: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  availableSeats: number;

  @ApiProperty({ example: 350 })
  @IsNumber()
  @Min(1)
  pricePerSeat: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  luggageAllowed?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  smokingAllowed?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  petsAllowed?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  womenOnly?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
