import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AuthenticateInput } from 'usecases/authenticate';

/**
 * Isso é apenas uma ideia de como poderia ser a validação usando o `class-validator` com o conceito de DTO e Mapper.
 */
export class AuthenticatePayload {
  @ApiProperty()
  @IsEmail()
  private email!: string;

  @ApiProperty()
  @IsString()
  private password!: string;

  get value(): AuthenticateInput {
    return {
      email: this.email,
      password: this.password,
    };
  }
}
