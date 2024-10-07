import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsMobilePhone,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class RegisterCustomerPayload {
  @ApiProperty({
    example: 'Jhon Doe',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: '+5511999999999',
  })
  @IsMobilePhone('pt-BR')
  phone!: string;

  @ApiProperty({
    example: 'jhon@doe.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password is too weak, it must have at least 8 characters, 1 lowercase, 1 uppercase, 1 number and 1 symbol',
    },
  )
  password!: string;
}
