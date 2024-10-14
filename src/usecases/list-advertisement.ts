import { Result } from '@/common/helpers';
import { Advertisement } from '@/domain/advertisement';
import { AdvertisementRepository } from '@/infra/database/repositories/advertisement-repository';
import { LoggerInject, LoggerService } from '@app/logx';
import { HttpException, InternalServerErrorException } from '@nestjs/common';

export class ListAdvertisementUseCase {
  constructor(
    @LoggerInject(ListAdvertisementUseCase.name)
    private readonly logger: LoggerService,
    private readonly repository: AdvertisementRepository,
  ) {}

  async handle(
    options: ListAdvertisementInput,
  ): Promise<ListAdvertisementOutput> {
    try {
      const advertisements = await this.repository.list(options);

      return Result.Ok(advertisements);
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

export type ListAdvertisementInput = {
  page: number;
  limit: number;
  orderBy: 'asc' | 'desc';
  customerId?: string;
};

export type ListAdvertisementOutput = Result<Advertisement[], HttpException>;
