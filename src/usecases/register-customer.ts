import { LoggerInject, LoggerService } from '@app/logx';
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Result } from 'common/helpers';
import { createCustomerProfile } from 'domain/customer/profile';
import { CustomersRepository } from 'infra/database/repositories/customers-repository';
import { HasherProvider } from 'infra/providers/hasher';
import { v7 as uuid } from 'uuid';

export class RegisterCustomerProfileUseCase {
  constructor(
    @LoggerInject(RegisterCustomerProfileUseCase.name)
    private readonly logger: LoggerService,
    private readonly hasher: HasherProvider,
    private readonly repository: CustomersRepository,
  ) {}

  async handle(
    payload: RegisterCustomerInput,
  ): Promise<RegisterCustomerOutput> {
    try {
      const { name, phone, email, password } = payload;

      const profileExists = await this.repository.findByEmail(email);

      if (profileExists) {
        return Result.Err(
          new ConflictException({
            name: 'CustomerAlreadyExists',
            message: 'A customer with this email already exists',
          }),
        );
      }

      const customerId = uuid();

      const profile = createCustomerProfile({
        name,
        email,
        password: await this.hasher.hash(password),
        avatar: 'https://avatars.githubusercontent.com/u/14010295?v=4',
        phone,
        customerId,
      });

      await this.repository.create(profile);

      return Result.Ok();
    } catch (error) {
      console.log(error);

      this.logger.error(
        `An unexpected error occurred - ${(error as Error).message}`,
      );

      return Result.Err(
        new InternalServerErrorException({
          name: 'UnexpectedError',
          message: `An unexpected error occurred - ${(error as Error).message}`,
        }),
      );
    }
  }
}

export type RegisterCustomerInput = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type RegisterCustomerOutput = Result<void, HttpException>;
