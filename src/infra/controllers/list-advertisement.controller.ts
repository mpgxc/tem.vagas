import { Advertisement } from '@/domain/advertisement';
import { CurrentCustomer as CurrentCustomerPayload } from '@/infra/auth/access-token.strategy';
import { ListAdvertisementUseCase } from '@/usecases/list-advertisement';
import { LoggerInject, LoggerService } from '@app/logx';
import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '../auth/current-customer.decorator';
import { Public } from '../auth/public.decorator';

@ApiBearerAuth()
@ApiTags('Advertisements')
@Controller('advertisements')
export class ListAdvertisementController {
  constructor(
    @LoggerInject(ListAdvertisementController.name)
    private readonly logger: LoggerService,
    private readonly usecase: ListAdvertisementUseCase,
  ) {}

  @Public()
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The records have been successfully fetched.',
  })
  async handle(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<Advertisement[]> {
    const output = await this.usecase.handle({
      page: page || 1,
      limit: limit || 10,
      orderBy: orderBy ?? 'asc',
    });

    if (!output.isOk) {
      this.logger.error('Advertisements not fetched', output.error);

      throw output.error;
    }

    this.logger.log('Advertisements fetched');

    return output.value;
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'The records have been successfully fetched.',
  })
  async handleMe(
    @CurrentCustomer() customer: CurrentCustomerPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('orderBy') orderBy?: 'asc' | 'desc',
  ): Promise<Advertisement[]> {
    const output = await this.usecase.handle({
      page: page ?? 1,
      limit: limit ?? 10,
      orderBy: orderBy ?? 'asc',
      customerId: customer.customerId,
    });

    if (!output.isOk) {
      this.logger.error('Advertisements not fetched', output.error);

      throw output.error;
    }

    this.logger.log('Advertisements fetched');

    return output.value;
  }
}
