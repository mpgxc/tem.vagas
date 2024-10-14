import { ExcludeKeys, Result } from '@/common/helpers';
import { Customer } from '@/domain/customer';
import { CustomersRepository } from '@/infra/database/repositories/customers-repository';
import { HasherProvider } from '@/infra/providers/hasher';
import { LoggerInject, LoggerService } from '@app/logx';
import {
  ConflictException,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

export class RegisterCustomerProfileUseCase {
  constructor(
    @LoggerInject(RegisterCustomerProfileUseCase.name)
    private readonly logger: LoggerService,
    private readonly hasher: HasherProvider,
    private readonly repository: CustomersRepository,
  ) {}

  private getAvatar(name: string): string {
    return `https://ui-avatars.com/api/?name=${name}&background=random`;
  }

  async handle(
    payload: RegisterCustomerInput,
  ): Promise<RegisterCustomerOutput> {
    try {
      if (payload.role === 'Administrador') {
        return Result.Err(
          new ForbiddenException({
            name: 'InvalidCustomerRole',
            message: `Invalid customer role: ${payload.role} - Administrador is not allowe to be created using this endpoint`,
          }),
        );
      }

      const exists = await this.repository.findUnique({
        email: payload.email,
        document: payload.document,
        phone_number: payload.phone_number,
      });

      if (exists) {
        return Result.Err(
          new ConflictException({
            name: 'CustomerAlreadyExists',
            message: `A customer with this <${exists.keys}> already exists`,
          }),
        );
      }

      const customer = Customer.safeParse(payload);

      if (!customer.success) {
        return Result.Err(
          new ConflictException({
            name: 'InvalidCustomerPayload',
            message: `Invalid customer payload: ${customer.error.message}`,
          }),
        );
      }

      customer.data.avatar = this.getAvatar(customer.data.full_name);
      customer.data.password = await this.hasher.hash(customer.data.password);

      await this.repository.create(customer.data);

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

export type RegisterCustomerInput = ExcludeKeys<
  Customer,
  'id' | 'avatar' | 'created_at' | 'updated_at'
>;

export type RegisterCustomerOutput = Result<void, HttpException>;

/**
 * @todo: Remover erros http do usecase e tratar no controller, na camada dos casos deverá ser tratado apenas erros de negócio (Erros como Objetos)
 */
