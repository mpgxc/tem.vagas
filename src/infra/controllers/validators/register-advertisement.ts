import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export enum AdvertisementStatus {
  Disponivel = 'Disponivel',
  Alugado = 'Alugado',
  Pausado = 'Pausado',
  Vendido = 'Vendido',
  Expirado = 'Expirado',
}

export class Address {
  @ApiProperty({
    example: 'São Paulo',
    description: 'Cidade onde o imóvel está localizado.',
  })
  @IsString()
  city!: string;

  @ApiProperty({
    example: 'SP',
    description: 'Estado onde o imóvel está localizado.',
  })
  @IsString()
  state!: string;

  @ApiProperty({
    example: 'Rua das Flores',
    description: 'Nome da rua onde o imóvel está localizado.',
  })
  @IsString()
  street!: string;

  @ApiProperty({ example: '123', description: 'Número do imóvel.' })
  @IsString()
  number!: string;

  @ApiProperty({
    example: '01234-567',
    description: 'Código postal do imóvel.',
  })
  @IsString()
  zip_code!: string;

  @ApiProperty({ example: -23.5505, description: 'Latitude do imóvel.' })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: -46.6333, description: 'Longitude do imóvel.' })
  @IsNumber()
  longitude!: number;
}
export class RegisterAdvertisementPayload {
  @ApiProperty({
    example: 'Apartamento à venda',
    description: 'Título do anúncio.',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'Apartamento de 2 quartos no centro da cidade.',
    description: 'Descrição do anúncio.',
  })
  @IsString()
  description!: string;

  @ApiProperty({ example: 'Centro', description: 'Localização do imóvel.' })
  @IsString()
  location!: string;

  @ApiProperty({ example: 250000, description: 'Preço do imóvel.' })
  @IsNumber()
  price!: number;

  @ApiProperty({ example: 2, description: 'Número de quartos.' })
  @IsNumber()
  bedrooms!: number;

  @ApiProperty({ example: 1, description: 'Número de banheiros.' })
  @IsNumber()
  bathrooms!: number;

  @ApiProperty({ example: 1, description: 'Número de vagas na garagem.' })
  @IsNumber()
  garage!: number;

  @ApiProperty({
    example: 70,
    description: 'Área do imóvel em metros quadrados.',
  })
  @IsNumber()
  area!: number;

  @ApiProperty({
    example: 'apartamento-2-quartos',
    description: 'Slug do anúncio.',
  })
  @IsString()
  slug!: string;

  @ApiProperty({
    example: true,
    description: 'Indica se o imóvel é mobiliado.',
  })
  @IsBoolean()
  is_furnished!: boolean;

  @ApiProperty({
    example: ['url-da-imagem1.jpg', 'url-da-imagem2.jpg'],
    description: 'URLs das imagens do imóvel.',
  })
  @IsArray()
  image_urls!: string[];

  @ApiProperty({
    enum: AdvertisementStatus,
    example: AdvertisementStatus.Disponivel,
    description: 'Status do anúncio.',
  })
  @IsEnum(AdvertisementStatus)
  status!: AdvertisementStatus;

  @ApiProperty({ type: Address, description: 'Endereço do imóvel.' })
  @Type(() => Address)
  @ValidateNested({ each: true })
  address!: Address;
}
