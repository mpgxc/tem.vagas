import { type CustomerRoles, Document } from '@/domain/customer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';

const CutomerRolesEnum = [
  'Administrador',
  'Corretor',
  'Imobiliaria',
  'Inquilino',
  'Proprietario',
] as CustomerRoles[];

export class RegisterCustomerPayload {
  @ApiProperty({
    required: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(300)
  bio!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  @Validate((value: string) => {
    return Document.safeParse(value).success;
  })
  document!: string;

  @ApiProperty({
    enum: ['CPF', 'CNPJ'],
    required: true,
  })
  @IsEnum(['CPF', 'CNPJ'])
  document_type!: 'CPF' | 'CNPJ';

  @ApiProperty({
    required: true,
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  full_name!: string;

  @ApiProperty({
    required: true,
  })
  @IsString()
  name!: string;

  @ApiProperty({
    required: true,
  })
  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  })
  password!: string;

  @ApiProperty({
    example: '5511999999999',
    required: true,
  })
  @IsPhoneNumber('BR', {
    each: true,
    message: 'phone_number must be a valid phone number',
  })
  phone_number!: string;

  @ApiProperty({
    enum: CutomerRolesEnum,
    required: true,
  })
  @IsEnum(CutomerRolesEnum, { each: true })
  role!: CustomerRoles;
}
