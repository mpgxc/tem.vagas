import { CurrentCustomer as CurrentCustomerPayload } from '@/infra/auth/access-token.strategy';
import { RegisterAdvertisementUseCase } from '@/usecases/register-advertisement';
import { LoggerInject, LoggerService } from '@app/logx';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer } from '../auth/current-customer.decorator';
import { RegisterAdvertisementPayload } from './validators/register-advertisement';

@ApiBearerAuth()
@ApiTags('Advertisements')
@Controller('advertisements')
export class RegisterAdvertisementController {
  constructor(
    @LoggerInject(RegisterAdvertisementController.name)
    private readonly logger: LoggerService,
    private readonly usecase: RegisterAdvertisementUseCase,
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  async handle(
    @CurrentCustomer() customer: CurrentCustomerPayload,
    @Body() payload: RegisterAdvertisementPayload,
  ): Promise<void> {
    const output = await this.usecase.handle({
      ...payload,
      customer_id: customer.customerId,
    });

    if (!output.isOk) {
      this.logger.error('Advertisement not created', output.error);

      throw output.error;
    }

    this.logger.log('Advertisement created');
  }
}
