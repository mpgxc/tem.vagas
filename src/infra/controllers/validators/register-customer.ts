import { type CustomerRoles } from '@/domain/customer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsDocumentType } from './decorators';

const CustomerRoles = [
  'Corretor',
  'Imobiliaria',
  'Inquilino',
  'Proprietario',
] as CustomerRoles[];

export class RegisterCustomerPayload {
  @ApiProperty({
    required: true,
    example: 'A short description about the customer',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(300)
  @IsNotEmpty()
  bio!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsDocumentType()
  @IsNotEmpty()
  document!: string;

  @ApiProperty({
    enum: ['CPF', 'CNPJ'],
    required: true,
  })
  @IsEnum(['CPF', 'CNPJ'])
  @IsNotEmpty()
  document_type!: 'CPF' | 'CNPJ';

  @ApiProperty({
    required: true,
    example: 'mpgxc@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  full_name!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    required: true,
    example: 'P@ssw0rdX55',
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    example: '5511999999999',
    required: true,
  })
  @IsPhoneNumber('BR', {
    each: true,
    message: 'phone_number must be a valid phone number',
  })
  @IsNotEmpty()
  phone_number!: string;

  @ApiProperty({
    enum: CustomerRoles,
    required: true,
  })
  @IsEnum({
    enum: CustomerRoles,
  })
  role!: CustomerRoles;
}
