import { AuthenticateInput } from '@/usecases/authenticate';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

/**
 * Isso é apenas uma ideia de como poderia ser a validação usando o `class-validator` com o conceito de DTO e Mapper.
 */
export class AuthenticatePayload {
  @ApiProperty({
    required: true,
    example: 'mpgxc@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  private email!: string;

  @ApiProperty({
    required: true,
    example: 'P@ssw0rdX55',
  })
  @IsString()
  @IsNotEmpty()
  private password!: string;

  get value(): AuthenticateInput {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
