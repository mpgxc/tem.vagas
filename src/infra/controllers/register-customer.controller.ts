import { LoggerInject, LoggerService } from '@app/logx';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'infra/auth/public.decorator';
import { RegisterCustomerProfileUseCase } from 'usecases/register-customer';
import { RegisterCustomerPayload } from './validators/register-customer';

@ApiTags('Customers')
@Controller('customers')
export class RegisterCustomerProfileController {
  constructor(
    @LoggerInject(RegisterCustomerProfileController.name)
    private readonly logger: LoggerService,
    private readonly usecase: RegisterCustomerProfileUseCase,
  ) {}

  @Post('/')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  async handle(@Body() payload: RegisterCustomerPayload): Promise<void> {
    const output = await this.usecase.handle(payload);

    if (!output.isOk) {
      this.logger.error('Customer Profile not created', output.error);

      throw output.error;
    }

    this.logger.log('Customer Profile created');
  }
}
