import { LoggerInject } from '@app/logx';
import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  LoggerService,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CurrentCustomer as CurrentCustomerPayload } from 'infra/auth/access-token.strategy';
import { CurrentCustomer } from 'infra/auth/current-customer.decorator';

@ApiBearerAuth('JWT')
@ApiTags('Customers')
@Controller('customers')
export class CustomerProfileController {
  constructor(
    @LoggerInject(CustomerProfileController.name)
    private readonly logger: LoggerService,
  ) {}

  @Get('profile')
  @ApiOkResponse({
    description: 'The profile of the current customer.',
    // type: @todo
  })
  @HttpCode(HttpStatus.OK)
  async profile(@CurrentCustomer() user: CurrentCustomerPayload): Promise<any> {
    this.logger.log(`Account <${user.customerId}> is requesting his profile.`);

    return user;
  }
}
