import { ExcludeKeys, Replace, Result } from '@/common/helpers';
import { Address, Advertisement } from '@/domain/advertisement';
import { AdvertisementRepository } from '@/infra/database/repositories/advertisement-repository';
import { LoggerInject, LoggerService } from '@app/logx';
import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import slugify from 'slugify';

export class RegisterAdvertisementUseCase {
  constructor(
    @LoggerInject(RegisterAdvertisementUseCase.name)
    private readonly logger: LoggerService,
    private readonly repository: AdvertisementRepository,
  ) {}

  private slugify = (title: string): string =>
    slugify(title, {
      replacement: '-',
      lower: true,
      strict: true,
      locale: 'pt-br',
    });

  async handle(
    payload: RegisterAdvertisementInput,
  ): Promise<RegisterAdvertisementOutput> {
    try {
      payload.slug = this.slugify(payload.title);

      const exists = await this.repository.findBySlug(payload.slug);

      if (exists) {
        this.logger.error('Advertisement already exists');

        return Result.Err(
          new ConflictException({
            name: 'AdvertisementExists',
            message: `Advertisement already exists with slug ${payload.slug}`,
          }),
        );
      }

      const address = Address.safeParse(payload.address);

      if (!address.success) {
        this.logger.error(
          `Invalid address data - ${address.error.errors.join(', ')}`,
        );

        return Result.Err(
          new InternalServerErrorException({
            name: 'InvalidData',
            message: `Invalid address data - ${address.error.errors.join(', ')}`,
          }),
        );
      }

      const advertisement = Advertisement.safeParse({
        ...payload,
        address: address.data,
      });

      this.logger.debug(advertisement);

      if (!advertisement.success) {
        this.logger.error(
          `Invalid advertisement data - ${advertisement.error.errors.join(', ')}`,
        );

        return Result.Err(
          new InternalServerErrorException({
            name: 'InvalidData',
            message: `Invalid advertisement data - ${advertisement.error.errors.join(', ')}`,
          }),
        );
      }

      await this.repository.create(advertisement.data);

      return Result.Ok();
    } catch (error) {
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

export type RegisterAdvertisementInput = Replace<
  ExcludeKeys<Advertisement, 'id' | 'created_at' | 'updated_at'>,
  {
    address: ExcludeKeys<Address, 'id' | 'created_at' | 'updated_at'>;
  }
>;

export type RegisterAdvertisementOutput = Result<void, HttpException>;
